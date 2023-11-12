function simulate(data,svg)
{
    // Extract width and height from the viewBox
    const width = parseInt(svg.attr("viewBox").split(' ')[2])
    const height = parseInt(svg.attr("viewBox").split(' ')[3])
    const main_group = svg.append("g")
        .attr("transform", "translate(0, 50)")

    // Calculate degree of the nodes:
    let node_degree={}; 
    d3.map(data.links, (d)=>{
       if(d.source in node_degree)
       {
           node_degree[d.source]++
       }
       else{
           node_degree[d.source]=0
       }
       if(d.target in node_degree)
       {
           node_degree[d.target]++
       }
       else{
           node_degree[d.target]=0
       }
   })

    // Linear scale for node radius 
    const citationExtent = d3.extent(data.nodes, d => d.Number_of_Citations);
    const scale_radius = d3.scaleLinear()
        .domain(citationExtent)
        .range([5, 20]);    

    // Color Scale for the nodes based on Country
    const countries = [...new Set(data.nodes.map(d => d.Country))];

    const color = d3.scaleOrdinal()
        .domain(countries)
        .range(d3.schemeCategory10);

    // Link data
    const link_elements = main_group.append("g")
        .attr('transform',`translate(${width/2},${height/2})`)
        .selectAll(".line")
        .data(data.links)
        .enter()
        .append("line");

    // Node data
    const node_elements = main_group.append("g")
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .selectAll(".circle")
        .data(data.nodes)
        .enter()
        .append('g')
        // Grouping based on Country
        .attr("class",function (d){return "country-"+ d.Country.replace(/\s/g, '_')})
        .on("mouseenter",function (d,data){
            // Highlight nodes of the same country on Hover
            node_elements.classed("inactive",true)
            d3.selectAll(".country-"+data.Country.replace(/\s/g, '_')).classed("inactive", false);
        })
        .on("mouseleave", (d,data)=>{
            d3.selectAll(".inactive").classed("inactive",false)
        })
        .on("click", function(event, d) {
            // Detail on demand - Author details when we click on a node
            d3.select("#author-details").html(`Name: ${d.Name}<br>` + `Author ID: ${d.id}<br>` + `Country: ${d.Country}<br>` + 
                                            `Number of Publications: ${d.Number_of_Publications}<br>` + 
                                            `Number of Citations: ${d.Number_of_Citations}`);
            d3.select("#detailsPanel").style("display", "block");
            })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))   

        // Append circle elements to represent nodes
    node_elements.append("circle")
        .attr("r", d => scale_radius(d.Number_of_Citations))
        .attr("fill",  d=> color(d.Country))
        .attr("stroke", "black")
        .attr("stroke-width", 0.2)
        // Author name when we hover on a node
        .append("title") 
        .text(d => d.Name);

    // Force simulation with collision with the number of citations as a factor for radius, charge force, and link force
    let ForceSimulation = d3.forceSimulation(data.nodes)
        .force("collide",
            d3.forceCollide().radius(d => scale_radius(d.Number_of_Citations) * 2.5))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("charge", d3.forceManyBody())
        .force("link",d3.forceLink(data.links)
            .id(d=>d.id)
        )
        .on("tick", ticked);

    function ticked()
    {
    node_elements
        .attr('transform', (d)=>`translate(${d.x},${d.y})`)
        link_elements
            .attr("x1",d=>d.source.x)
            .attr("x2",d=>d.target.x)
            .attr("y1",d=>d.source.y)
            .attr("y2",d=>d.target.y)

        }
    
    // zoom
    svg.call(d3.zoom()
        .extent([[0, 0], [width, height]])
        .scaleExtent([1, 8])
        .on("zoom", zoomed));
    function zoomed({transform}) {
        main_group.attr("transform", transform);
    }
    // Node drag functionality
    function dragstarted(event, d) {
        if (!event.active) ForceSimulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) ForceSimulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
    // Updating the ForceSimulation based on input values
    document.getElementById("controlForm").addEventListener("submit", function(e) {
        e.preventDefault();

        let linkStrength = +document.getElementById("linkStrength").value;
        let chargeForce = +document.getElementById("chargeStrength").value;
        let collideRadius = +document.getElementById("collideStrength").value;
        let nodeSize = document.querySelector('input[name="nodeSize"]:checked').value;
            
        ForceSimulation
            .force("link", d3.forceLink(data.links).id(d => d.id).strength(linkStrength))
            .force("charge", d3.forceManyBody().strength(chargeForce))
            .force("collide", d3.forceCollide().radius(collideRadius));

        node_elements.select("circle").attr("r", d => {
            if (node_degree[d.id] !== undefined) {
                if (nodeSize === 'No_of_Citations') {
                    const citationExtent = d3.extent(data.nodes, d => d.Number_of_Citations);
                    const scale_radius = d3.scaleLinear()
                        .domain(citationExtent)
                        .range([5, 20]);
                    return scale_radius(d.Number_of_Citations);
                } else if (nodeSize === 'No_of_Publications') {
                    const citationExtent = d3.extent(data.nodes, d => d.Number_of_Publications);
                    const scale_radius = d3.scaleLinear()
                        .domain(citationExtent)
                        .range([5, 20]);
                    return scale_radius(d.Number_of_Publications);
                } else if (nodeSize === 'Degree') {
                    const citationExtent = d3.extent(Object.values(node_degree));
                    const scale_radius = d3.scaleLinear()
                        .domain(citationExtent)
                        .range([5, 20]);
                    return scale_radius(node_degree[d.id]);
                } else {
                    return scale_radius(0);
                }
            } else {
                return scale_radius(0);
            }
        });
    });

}