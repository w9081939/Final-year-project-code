//Generates a graph with n vertices and m edges (each graph has equal probability of been chosen)
function generateUniformRandomGraph(n, m) {
  let edgeSet = new Map(); //Create an empty edge set
  let vertexSet = new Map([...Array(n).keys()].map((l) => [l, new Vertex(l)])); //Create a vertex set of size n
  let possibleEdges = getAllPossibleEdges([...vertexSet.keys()]); //Compute all possible edges for the given vertex set

  //Loop from 0 to m - 1 (i.e., m times)
  for(let i = 0; i < m; i++) {
    let randomIndex = Math.floor(Math.random() * possibleEdges.length) //Pick a random number between 0 and the number of possible edges
    let edge = possibleEdges.splice(randomIndex, 1)[0] //Choose (and remove) the edge in the array of possibleEdges at this random index

    //Sets the endpoints of the edge to be neighbours of each other
    vertexSet.get(edge[0]).addNeighbour(edge[1]);
    vertexSet.get(edge[1]).addNeighbour(edge[0]);

    //Add the edge to the edge set
    edgeSet.set(JSON.stringify(edge), true);
  }

  //Once m edges have been added to the edge set return the vertex and edge set
  return {vertexSet, edgeSet}
}

//USAGE:
//To create a graph write in the console while index.html is open or write in index.html and then run the file, the following:
//let graph = new Graph(generateUniformRandomGraph(n, m)) (n and m can be any integer, if they are too large it will take awhile to run)
