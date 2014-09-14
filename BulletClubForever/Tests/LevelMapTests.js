QUnit.test("Test initial map is all set to .", function (assert) {
    var x = 100;
    var y = 20;
    var levelMap = new LevelMap(x, y);

    assert.ok(levelMap.map !== undefined, "map property is initially not undefined.");
    assert.ok(levelMap.map.length === 0, "map property is initially empty.");

    levelMap.init();

    assert.ok(levelMap.map.length === x, "x axis is correct length.");
    assert.ok(levelMap.map[0].length === y, "y axis is correct length.");
});



QUnit.test("Test createRandom - number between 1 and 5 inclusive.", function (assert) {
    var aRandomNumber = createRandom(5);
    assert.ok(aRandomNumber !== NaN, "A number was created.");
    assert.ok(aRandomNumber < 6, "The number was less than 6.");
    assert.ok(aRandomNumber > 0, "The number was greater than 0.");
});

QUnit.test("Tests createRandomBool - creates a boolean.", function (assert) {
    var aBool = createRandomBool(10);
    assert.ok((aBool === true) || (aBool === false), "The boolean is either true or false.");
});