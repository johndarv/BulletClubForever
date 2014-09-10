QUnit.test("Test initial map is all set to .", function (assert) {
    var levelMap = new LevelMap();

    assert.ok(levelMap.map !== undefined, "map property is initially not undefined.");
    assert.ok(levelMap.map.length === 0, "map property is initially empty.");

    levelMap.init();

    assert.ok(levelMap.map.length === levelMap.y, "y axis is correct length.");
    assert.ok(levelMap.map[0].length === levelMap.x, "x axis is correct length.");

    var passed = true;

    for (var i = 0; i < levelMap.y; i++) {
        for (var j = 0; j < levelMap.x; j++) {
            if (levelMap.map[i][j] !== ".") {
                passed = false;
            }
        }
    }

    assert.ok(passed, "map property is initially set to all dots.");
});