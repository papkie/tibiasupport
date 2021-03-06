// CONFIG

const hotkeys = {
  hp: [{
    type: 'lt', //less than
    percent: 90,
    hotkey: 'f4',
    interval: 2, //seconds
  }],
  mp: [{
    type: 'gt', //greater than
    percent: 20,
    hotkey: 'f5',
    interval: 2, //seconds
  }]
}



// FUNCTIONS
var robot = require("robotjs");

async function waitForButton() {
  return new Promise(res => {
    process.stdin.once('data', (data: any) => {
      res(data.toString())
    });
  })
}

function getColor(pos: any = {}) {
  if (!pos.x || !pos.y) {
    pos = robot.getMousePos();
  }
  return {
    color: robot.getPixelColor(pos.x, pos.y),
    pos
  }
}

function findBar(pos: any, filledColor: any) {
  //seeking to the left
  let changes = 0
  let leftPos = Object.assign({}, pos)
  while (changes < 2) {
    let color = getColor(leftPos)
    if (color.color !== filledColor) {
      changes++
    }
    leftPos.x--
  }
  changes = 0
  let rightPos = Object.assign({}, pos)
  while (changes < 4) {
    let color = getColor(rightPos)
    if (color.color !== filledColor) {
      changes++
    }
    rightPos.x++
  }

  return [leftPos, rightPos];
}

function calculateCurrentBar(barSetting: any) {
  let pos = Object.assign({}, barSetting.range[0])
  let changes = 0
  while (changes < 4) {
    let color = getColor(pos)
    if (color.color !== barSetting.filledColor) {
      changes++
    }
    pos.x++
  }
  return (pos.x - barSetting.range[0].x)/(barSetting.range[1].x - barSetting.range[0].x)
}

let barSettings = {
  hp: {
    range: [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }],
    filledColor: '000000'
  },
  mp: {
    range: [{
      x: 0,
      y: 0
    }, {
      x: 0,
      y: 0
    }],
    filledColor: '000000'
  },
}

async function go() {
  console.log('> HP Configuration');
  console.log('Point 100% filled hp bar and press [enter]');
  await waitForButton()
  let currentColor = getColor()
  console.log('Looking for hp bar...');
  barSettings.hp.range = findBar(currentColor.pos, currentColor.color)
  barSettings.hp.filledColor = currentColor.color
  console.log(barSettings.hp);
  console.log('> MP Configuration');
  console.log('Point 100% filled mp bar and press [enter]');
  await waitForButton()
  currentColor = getColor()
  console.log('Looking for mp bar...');
  barSettings.mp.range = findBar(currentColor.pos, currentColor.color)
  barSettings.mp.filledColor = currentColor.color
  console.log(barSettings.mp);

  watcher()
}

go().catch(console.error)

let jobTimestamps: any[] = []

function watcher() {
  let jobId = 0
  hotkeys.hp.forEach(hotkey => {
    if (Date.now() - (hotkey.interval*1000) < jobTimestamps[jobId]) {
      return
    }
    const currentHp = calculateCurrentBar(barSettings.hp) * 100
    if (hotkey.type === 'gt' && currentHp > hotkey.percent) {
      robot.keyTap(hotkey.hotkey)
    }
    if (hotkey.type === 'lt' && currentHp < hotkey.percent) {
      robot.keyTap(hotkey.hotkey)
    }
    jobTimestamps[jobId++] = Date.now()
  })
  hotkeys.mp.forEach(hotkey => {
    if (Date.now() - (hotkey.interval*1000) < jobTimestamps[jobId]) {
      return
    }
    const currentMp = calculateCurrentBar(barSettings.mp) * 100
    if (hotkey.type === 'gt' && currentMp > hotkey.percent) {
      robot.keyTap(hotkey.hotkey)
    }
    if (hotkey.type === 'lt' && currentMp < hotkey.percent) {
      robot.keyTap(hotkey.hotkey)
    }
    jobTimestamps[jobId++] = Date.now()
  })

  setTimeout(() => {
    watcher()
  }, 100);
}