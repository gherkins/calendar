import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import * as fs from 'fs'
import moment from 'moment'
import tinycolor from 'tinycolor2'

const year = parseInt(process.argv[2] || moment().format('YYYY'))
const firstDayOfYear = moment(`${year}-01-01`)
const lastDayOfYear = firstDayOfYear.clone().endOf('year')

const weeks = []
const current = firstDayOfYear.clone().startOf('isoWeek')

let lastMonthName = null

while (current <= lastDayOfYear) {

  let monthName = current.format('MMM').toUpperCase()
  if (current.week() === 1) {
    monthName = 'JAN'
  }
  if (current.week() >= 52) {
    monthName = lastMonthName
  }

  let label = current.format('WW')
  if (monthName !== lastMonthName) {
    label = monthName
  }

  lastMonthName = monthName
  const week = []
  week.push(label)
  for (let i = 0; i < 7; i++) {
    week.push(current.format('DD'))
    current.add(1, 'day')
  }
  weeks.push(week)
}

const color = process.argv[3] || '56E39F'

const defaultCellWidth = 25
const doc = new jsPDF()
doc.autoTable({
  styles: { fontSize: 3.75, halign: 'left', textColor: 'black' },
  headStyles: { halign: 'left', fontStyle: 'bold', fillColor: null },
  bodyStyles: { textColor: 'darkgray', lineWidth: { top: 0.1, left: 0.1 } },
  columnStyles: {
    lineWidth: { top: 0.1 },
    0: { fontStyle: 'bold', halign: 'right', cellWidth: 7, textColor: 'black', lineWidth: { top: 0.1, left: 0 } },
    1: { cellWidth: defaultCellWidth },
    2: { cellWidth: defaultCellWidth },
    3: { cellWidth: defaultCellWidth },
    4: { cellWidth: defaultCellWidth },
    5: { cellWidth: defaultCellWidth },
    6: { fillColor: tinycolor(color).lighten(30).toString(), cellWidth: defaultCellWidth },
    7: { fillColor: tinycolor(color).lighten(25).toString(), cellWidth: defaultCellWidth },
  },
  margin: { top: 10, bottom: 10 },
  head: [['', 'MO', 'DI', 'MI', 'DO', 'FR', 'SA', 'SO']],
  body: weeks,
})

const outfile = `calendar-${year}.pdf`
if (fs.existsSync(outfile)) {
  fs.unlinkSync(outfile)
}
doc.save(outfile)
