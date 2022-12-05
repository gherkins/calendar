import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import * as fs from 'fs'

const year = 2023

const doc = new jsPDF()

const date = new Date(`${year}-01-01`)
const startDate = new Date(date.getFullYear(), 0, 1)

let lastWeekNumber = null

const dates = {}
while (date.getFullYear() < year + 1) {
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000))
  const weekNumber = Math.ceil(days / 7)

  const day = date.getDay() === 0 ? 7 : date.getDay()

  //init new week
  if (weekNumber !== lastWeekNumber) {
    dates[weekNumber] = [weekNumber <= 52 ? weekNumber : 1]
  }

  //use month name instead of week number
  if (date.getDate() === 1) {
    dates[weekNumber][0] = date.toLocaleString('de-DE', { month: 'short' }).toUpperCase()
  }

  //fill empty days
  if (Object.keys(dates).length === 1) {
    while (day !== dates[weekNumber].length) {
      dates[weekNumber].push('')
    }
  }

  dates[weekNumber].push(date.getDate())
  date.setDate(date.getDate() + 1)
  lastWeekNumber = weekNumber
}
const weeks = []
for (let weekNumber in dates) {
  weeks.push(dates[weekNumber])
}
while (weeks[weeks.length - 1].length < 8) {
  weeks[weeks.length - 1].push('')
}

doc.autoTable({
  styles: { fontSize: 3.75, halign: 'left', textColor: 'black' },
  headStyles: { halign: 'left', fontStyle: 'bold', cellWidth: 'auto', fillColor: null },
  bodyStyles: { textColor: 'darkgray', lineWidth: { top: 0.1, left: 0.1 } },
  columnStyles: {
    lineWidth: { top: 0.1 },
    0: { fontStyle: 'bold', halign: 'right', cellWidth: 7, textColor: 'black', lineWidth: { top: 0.1, left: 0 } },
    6: { fillColor: '#fcf7dd' },
    7: { fillColor: '#f9f0ca' },
  },
  margin: { top: 10, bottom: 10 },
  head: [['', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO']],
  body: weeks,
})

const outfile = 'calendar.pdf'
if (fs.existsSync(outfile)) {
  fs.unlinkSync(outfile)
}
doc.save(outfile)
