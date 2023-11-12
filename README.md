# Author Network Visualization

This project focuses on visualizing a complex network of academic publications and their authors using the NetworkX Python library for data processing and D3.js for an interactive force layout visualization. The dataset, sourced from the Scopus database and formatted as a CSV file, reveals intricate connections between publications, authors, affiliations, and countries.

## Step 1: Data Processing
Utilized NetworkX for processing network data, unveiling hidden relationships by considering metadata such as authors, author IDs, titles, affiliations, correspondence addresses, abstracts, and publication years.
Explored the network of authors and their co-authorship relationships.  

Processed the data by creating necessary columns like Number of Publications, Number of Citations etc and handling missing entries, either by dropping them or looking up the necessary information online.
Generated a JSON file containing nodes and links based on Author Network Data using NetworkX.

## Step 2: Network Visualization
Created an interactive force layout visualization using D3.js.

 - Connect Nodes Using Links (Co-authorship):  Established links between nodes (Authors) based on co-authorship relationships.

Cluster Apply Class to Data by Author's Country:  

Successfully clustered data based on the author's country, applying a class for effective categorization.

Use Force Simulation for Visualization:  

Implemented a compelling force layout visualization using D3.js, with the number of citations as a key factor for node sizing.

Apply 'Charge' and 'Collision' Forces:  

Enhanced layout and prevented node overlap through effective application of d3.forceManyBody() and d3.forceCollide().
Considered the number of citations as a factor for d3.forceCollide() radius

Apply Styling, Color Coding, Pan, Zoom and Node Drag Functionality:  

Ensured a visually appealing and user-friendly experience by implementing styling, color coding, and pan/zoom functionality.
Introduced node drag functionality, offering users additional control over the visualization.

Customization:  

Customized the webpage by incorporating a form into the HTML page, allowing users to control link strengths, collide and charge force properties, and select node size preferences. Implemented a side panel displaying detailed author information upon mouse click (Detail on Demand).

Network Visualization:  

Open the HTML page on GitHub Pages to explore the interactive force layout visualization.

## Conclusion
This project seamlessly integrates data processing, advanced network analysis, and interactive D3.js implementation. It delivers a comprehensive and insightful exploration of the relationships between academic publications and their authors. The incorporation of parameter controls in the webpage enhances the user experience.
