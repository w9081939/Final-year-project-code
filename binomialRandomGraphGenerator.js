//Generates a graph with n vertices and for each possible edge, it is added with probability p and not with probability 1-p
function generateBinomialRandomGraph(n, p) {
  if(p > 1 || p < 0) return false //Return immediately if an incorrect probability is passed as p

  let edgeSet = new Map(); //Create an empty edge set
  let vertexSet = new Map([...Array(n).keys()].map((l) => [l, new Vertex(l)])); //Create a vertex set of size n
  let possibleEdges = getAllPossibleEdges([...vertexSet.keys()]); //Compute all possible edges for the given vertex set

  //For each possible edge
  possibleEdges.forEach((edge, i) => {
    //If the random number (between 0 and 1) is less than or equal to p
    if(Math.random() <= p) {
      //Sets the endpoints of the edge to be neighbours of each other
      vertexSet.get(edge[0]).addNeighbour(edge[1]);
      vertexSet.get(edge[1]).addNeighbour(edge[0]);

      //Add the edge to the edge set
      edgeSet.set(JSON.stringify(edge), true);
    }
  });

  //Once all possible edges have been process return the vertex set and edge set
  return {vertexSet, edgeSet}
}

//USAGE:
//To create a graph write in the console while index.html is open or write in index.html and then run the file, the following:
//let graph = new Graph(generateBinomialRandomGraph(n, p)) (n and p can be anything just keep p between 0 and 1 and n being an integer. If n is too large it will take awhile to run)
