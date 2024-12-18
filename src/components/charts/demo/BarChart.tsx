'use client'

import { faker } from '@faker-js/faker'
import 'chart.js/auto'
import { defaults } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'

// ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels, TimeScale)

defaults.color = 'white'
defaults.font.family = 'Lato'

const BarChart = () => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']

  const data = {
    labels,
    datasets: [
      {
        label: 'T1',
        data: labels.map(() => faker.number.int({ min: 0.1, max: 3 })),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        datalabels: {
          display: true,
          align: 'end',
          anchor: 'end',
          offset: -1,
          formatter: function (value: number) {
            if (value > 0) {
              return value
            } else {
              return ''
            }
          },
        },
      },
      // {
      //   label: 'T3',
      //   data: labels.map(() => faker.number.int({ min: 0.1, max: 3 })),
      //   borderColor: 'rgb(53, 162, 235)',
      //   backgroundColor: 'rgba(53, 162, 235, 0.5)',
      //   yAxisID: 'y',
      // },
    ],
  } as any

  const onClick = (event: any, clickedElements: any) => {
    if (clickedElements.length === 0) return
    const { dataIndex, raw } = clickedElements[0].element.$context // the value of the bar
    const barLabel = event.chart.data.labels[dataIndex] // the label of the bar

    // console.log(dataIndex)

    // let faults = dataArr[dataIndex].inspections.map((elem) => {
    //   return [...elem.failures]
    // })

    // console.log(faults.flat())

    // faultsHandler(faults.flat().sort((a, b) => new Date(a.failedAt) - new Date(b.failedAt)))
    // setBackgroundColors(barChartColorHandler(10, dataIndex, 'rgba(53, 162, 235, 0.5)', '#131e3a'))
    // setBorderWidths(barChartBorderWidthHandler(10, dataIndex, 3))

    // filterFaultsForModal(barLabel, 'fault')
  }

  const options = {
    onClick,
    maintainAspectRatio: false,
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: true,
    },
    stacked: false,
    plugins: {
      legend: {
        labels: {
          boxHeight: 2,
          // padding: 26,
        },
      },
      title: {
        display: true,
        // text: `${chartTitle}`,
        text: `Chart Title`,
        font: {
          size: 15,
        },
      },
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
          color: '#544C4A',
        },
        // title: {
        // 	display: true,
        // 	text: 'Minutes',
        // },
        // min: 0,
        // max: chartMax,
        ticks: {
          // Include a dollar sign in the ticks
          // callback: function (value, index, ticks) {
          // 	if (value % 5 === 0) {
          // 		return value
          // 	}
          // 	return null
          // },
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',

        grid: {
          display: true,
          color: '#544C4A',
        },
        title: {
          display: false,
          text: 'Minutes',
        },
      },

      // y1: {
      // 	type: 'linear',
      // 	display: false,
      // 	position: 'right',
      // 	grid: {
      // 		drawOnChartArea: false,
      // 	},
      // },
    },
  } as any
  return <Bar options={options} data={data} plugins={[ChartDataLabels]} />
}

export default BarChart
