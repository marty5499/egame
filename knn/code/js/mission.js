var missionJson = [
    {
        key: "newbie",
        title: "新手任務：薇薇安農產公司的新品種芒果",
        step: [0,0,0,0,0,0,1,0,0,0,0,0],
        func: {
            newbieCall: function() {
                var next = aiknn.mission.stage[aiknn.mission.stageNow].next;
                if (next >= aiknn.mission.totalStages()) window.open('../../menu.html');
                aiknn.mission.goStage(next);
            },
            newbieBack: function() {
                var back = (aiknn.mission.stageNow) ? aiknn.mission.stageNow - 1 : 0;
                aiknn.mission.goStage(back);
            }
        }
    }
];