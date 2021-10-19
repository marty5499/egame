class JSONTable {
    constructor(id) {
        this.ele = document.getElementById(id);
    }

    toTable(json) {
        var eleTable = this.updateJSON(json);
        this.ele.textContent = '';
        this.ele.appendChild(eleTable);
    }

    updateJSON(json) {
        // Extract value from table header. 
        let col = [];
        for (let i = 0; i < json.length; i++) {
            for (let key in json[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }
        // Create a table.
        const table = document.createElement("table");
        const insertPoint = document.getElementById('jsontable');
        // Create table header row using the extracted headers above.
        let tr = table.insertRow(-1); // table row.
        for (let i = 0; i < col.length; i++) {
            let th = document.createElement("th"); // table header.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }
        // add json data to the table as rows.
        for (let i = 0; i < json.length; i++) {
            tr = table.insertRow(-1);
            for (let j = 0; j < col.length; j++) {
                let tabCell = tr.insertCell(-1);
                tabCell.innerHTML = json[i][col[j]];
            }
        }
        return table;
    }
}