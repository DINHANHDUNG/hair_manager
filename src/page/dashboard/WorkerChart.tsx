import { Bar } from 'react-chartjs-2'
import { useGetStaticEmployeeByMonthQuery } from '../../app/services/statistic'
import { StaticEmployeeByMonthType } from '../../types/statistic'

export const WorkerChart = () => {
  const { data: dataStaticEmployeeByMonth } = useGetStaticEmployeeByMonthQuery({})
  const dataAPI = dataStaticEmployeeByMonth?.data || []
  const labels = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12'
  ]

  // Hàm để map dataAPI vào data
  const mapDataAPIToData = (dataAPI: StaticEmployeeByMonthType[]) => {
    // Khởi tạo mảng số liệu với giá trị 0 cho 12 tháng
    const mappedData = Array(12).fill(0)

    dataAPI.forEach((item) => {
      const monthIndex = parseInt(item.month.split('-')[0], 10) - 1
      mappedData[monthIndex] = item.count
    })

    return mappedData
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Số công nhân',
        data: mapDataAPIToData(dataAPI),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  }

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false // Hide heder my set data
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <div style={{ height: '50vh' }}>
      <Bar data={data} options={options} width={'100%'} />
    </div>
  )
}
