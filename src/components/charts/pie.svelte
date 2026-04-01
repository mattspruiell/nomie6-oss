<script type="ts">
  import { onMount } from 'svelte'
  import Chart from 'chart.js/auto'
  import nid from '../../modules/nid/nid'

  export let data: Array<IPieData> = []

  const chartId = `chart-${nid()}`

  interface IPieData {
    label: string
    value: number
    color: string
  }

  let myChart: Chart<"doughnut", number[], string> | undefined;

  function createDoughnut() {
    var ctx = document.getElementById(chartId) as HTMLCanvasElement
    if (!ctx) return

    if (myChart) {
      myChart.destroy()
    }

    myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: data.map((row) => row.label),
        datasets: [
          {
            backgroundColor: data.map((row) => row.color),
            data: data.map((row) => row.value),
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
        maintainAspectRatio: false,
      },
    })
  }

  $: if (data && typeof document !== 'undefined') {
    setTimeout(createDoughnut, 10)
  }

  onMount(() => {
    createDoughnut()
    return () => {
      if (myChart) myChart.destroy()
    }
  })
</script>

<canvas id={chartId} width="150" height="150" />
