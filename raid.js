const readlineSync = require('readline-sync')
const { table } = require('./table')

let disks = [] // диски
let choice, action
console.log('Введите число дисков:')
let diskAmount = readlineSync.question('')
console.log('Введите размер диска:')
let diskSize = readlineSync.question('')
let blockSize
diskAmount = parseFloat(diskAmount)
diskSize = parseFloat(diskSize)

let addBlock = () => {
    console.log('Введите объем данных в наборе:')
    blockSize = readlineSync.question(''); blockSize = parseFloat(blockSize)

    // Так как в RAID 6 два места занимают контрольные суммы
    let blockAmount = Math.floor(blockSize / (diskAmount - 2))
    let tmp = blockSize - blockAmount * (diskAmount - 2)
    let q = diskAmount - disks.length - 1
    let p = diskAmount - disks.length - 2
    let el = {}
    
    // диски пустые, проверки не нужны
    if (disks.length === 0) {
        let el = {}
        let i
        for (i = 0; i < diskAmount; i++) {
            el[`disk${i}`] = blockAmount
        }
        el[`disk${p}`] = 'P'
        el[`disk${q}`] = 'Q'

        for (let i = 0; i < diskAmount; i++) {
            if ((i !== p) && (i !== q)) {
                el[`disk${i}`] = blockAmount + tmp
                break
            }
        }
        disks.push(el)

    } else {
        // проверка заполненности диска
        let capacity = 0
        for (let j = 0; j < disks.length; j++) {
            if (disks[j].disk0 == 'P') {
                capacity += disks[j].disk2
            } else {
                capacity += disks[j].disk0
            }
        }
        let currentAmount = diskSize - capacity
        
        if ( currentAmount < blockAmount) {
            console.log('На дисках больше нет места.')
            return
        }

        for (i = 0; i < diskAmount; i++) {
            el[`disk${i}`] = blockAmount
        }
        el[`disk${p}`] = 'P'
        el[`disk${q}`] = 'Q'

        for (let i = 0; i < diskAmount; i++) {
            if ((i !== p) && (i !== q)) {
                el[`disk${i}`] = blockAmount + tmp
                break
            }
        }
        disks.push(el)
    }
}

let showRaid = () => {
    table(disks)
}

let countCapacity = () => {
    let res = (diskSize*diskAmount-blockSize*disks.length)/(diskSize*diskAmount)
    console.log(`Избыточность дискового пространства составляет ${res}`)
}

while (1) {
    console.log('1 - ввод данных.')
    console.log('2 - состояние RAID-массива.')
    console.log('3 - информация об избыточности дискового пространства.')
    console.log('Ваш выбор:')
    action = readlineSync.question(''); action = parseFloat(action)

    if (action === 1) {
        addBlock()
    } else if (action === 2) {
        showRaid()
    } else if (action === 3) {
        countCapacity()
    } else {
        break
    }

    // Запрос на продолжение работы с рейд массивом
    choice = readlineSync.question('Continue(yes/no):')
    if (choice !== 'yes') {
        break
    }
}