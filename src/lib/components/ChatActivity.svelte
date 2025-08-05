<script lang="ts">
  import type { Problem } from '$lib/types';
  import { onMount } from 'svelte';
  import * as d3 from 'd3';
  
  interface Props {
    problems: Problem[];
  }
  
  let { problems }: Props = $props();
  let container: HTMLDivElement;
  
  onMount(() => {
    if (!container) return;
    
    // Prepare data
    const chatData = problems.map((problem, index) => {
      const axiiaChats = problem.chats.filter(c => c.type === 'axiia').length;
      const customChats = problem.chats.filter(c => c.type === 'custom').length;
      
      return {
        problemIndex: index + 1,
        problemId: problem.problemId,
        axiia: axiiaChats,
        custom: customChats,
        total: axiiaChats + customChats
      };
    });
    
    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = container.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;
    
    // Create SVG
    const svg = d3.select(container)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Scales
    const x = d3.scaleBand()
      .domain(chatData.map(d => d.problemIndex.toString()))
      .range([0, width])
      .padding(0.1);
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(chatData, d => d.total) || 0])
      .nice()
      .range([height, 0]);
    
    // Create stack
    const stack = d3.stack<typeof chatData[0]>()
      .keys(['axiia', 'custom']);
    
    const series = stack(chatData);
    
    // Color scale
    const color = d3.scaleOrdinal()
      .domain(['axiia', 'custom'])
      .range(['#9333ea', '#4f46e5']);
    
    // Draw bars
    g.selectAll('.series')
      .data(series)
      .enter().append('g')
      .attr('fill', d => color(d.key) as string)
      .selectAll('rect')
      .data(d => d)
      .enter().append('rect')
      .attr('x', d => x(d.data.problemIndex.toString()) || 0)
      .attr('y', d => y(d[1]))
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth());
    
    // X axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).tickFormat(d => `P${d}`));
    
    // Y axis
    g.append('g')
      .call(d3.axisLeft(y));
    
    // Legend
    const legend = g.append('g')
      .attr('transform', `translate(${width - 100}, 0)`);
    
    const legendData = [
      { label: 'AXIIA', color: '#9333ea' },
      { label: 'Custom', color: '#4f46e5' }
    ];
    
    legend.selectAll('.legend-item')
      .data(legendData)
      .enter().append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 20})`)
      .each(function(d) {
        const item = d3.select(this);
        
        item.append('rect')
          .attr('width', 16)
          .attr('height', 16)
          .attr('fill', d.color);
        
        item.append('text')
          .attr('x', 20)
          .attr('y', 12)
          .style('font-size', '12px')
          .text(d.label);
      });
  });
</script>

<div class="bg-white rounded-lg shadow p-6">
  <h2 class="text-lg font-semibold text-gray-900 mb-4">Chat Activity by Problem</h2>
  <div bind:this={container} class="w-full"></div>
</div>