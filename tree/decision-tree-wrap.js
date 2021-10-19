class DecisionTree {

    constructor(id, config) {
        this.id = id;
        this.config = config;
        this.numberOfTrees = 6;
        this.serial = 0;
    }



    async trainingSet(csvFile) {
        let response = await fetch(`./${csvFile}`);
        this.jsonData = this.csvJSON(await response.text());
        this.config.trainingSet = JSON.parse(JSON.stringify(this.jsonData));
        this.analysis();
    }

    csvJSON(csv) {
        var lines = csv.split("\n");
        var result = [];
        var headers = lines[0].split("\t");
        for (var i = 1; i < lines.length; i++) {
            var obj = {};
            var currentline = lines[i].split("\t");
            for (var j = 0; j < headers.length; j++) {
                obj[headers[j]] = currentline[j];
            }
            result.push(obj);
        }
        return result; //JSON
    }

    getJSONData() {
        return this.jsonData;
    }

    analysis() {
        this.decisionTree = new dt.DecisionTree(this.config);
        this.randomForest = new dt.RandomForest(this.config, this.numberOfTrees);
        this.root = this.decisionTree.root;
    }

    predict(obj) {
        var result = this.decisionTree.predict(obj);
        var eleTree = document.getElementById(this.id);
        eleTree.innerHTML = this.treeToHtml(this.root);
        var markList = eleTree.getElementsByClassName('mark');
        this.paint(markList);
        return result;
    }

    paint(markList) {
        var idx = 0;
        var c = setInterval(function() {
            if (markList.length == idx) {
                clearInterval(c);
                return;
            }
            var ele = markList[idx++];
            ele.style['background-color'] = '#FF7799';
            ele.style['color'] = '#FFeeFF';
        }, 1000);
    }

    treeToHtml(tree) {
        var attr = typeof tree.attr == 'string' ? 'mark' : '';
        if (tree.category) {
            return ['<ul>',
                '<li>',
                '<a href="#" class="' + attr + '">',
                '<b>', tree.category, '</b>',
                '</a>',
                '</li>',
                '</ul>'
            ].join('');
        }
        var markYes = '',
            markNo = '';
        if (tree.mark) {
            markYes = 'mark';
        } else {
            markNo = 'mark';
        }
        if (typeof tree.mark == 'undefined') {
            markYes = '';
            markNo = '';
        }
        //var predicateName = tree.predicateName == '==' ? ' ' : '大於';
        var predicateName = tree.predicateName;
        return ['<ul>',
            '<li>',
            '<a href="#" class="' + attr + '" name="' + tree.attribute + '" pivot="' + tree.pivot + '">',
            '<b>', tree.attribute, ' ', predicateName, ' ', tree.pivot, '</b>',
            '</a>',
            '<ul>',
            '<li>',
            '<a href="#" class="' + markYes + '">yes</a>',
            this.treeToHtml(tree.match),
            '</li>',
            '<li>',
            '<a href="#" class="' + markNo + '">no</a>',
            this.treeToHtml(tree.notMatch),
            '</li>',
            '</ul>',
            '</li>',
            '</ul>'
        ].join('');
    }
}