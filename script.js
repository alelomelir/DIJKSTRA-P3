document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("grid");
    const startBtn = document.getElementById("startBtn");
    const clearBtn = document.getElementById("clearBtn");
    const numRows = 20;
    const numCols = 20;
    let startNode = null;
    let endNode = null;
    let isMouseDown = false;
  
    // Create the grid
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const cell = document.createElement("div");
        cell.dataset.row = row;
        cell.dataset.col = col;
        grid.appendChild(cell);
      }
    }
  
    grid.addEventListener("mousedown", (e) => {
      if (
        e.target.dataset.row !== undefined &&
        e.target.dataset.col !== undefined
      ) {
        isMouseDown = true;
        handleCellClick(e.target);
      }
    });
  
    grid.addEventListener("mouseover", (e) => {
      if (
        isMouseDown &&
        e.target.dataset.row !== undefined &&
        e.target.dataset.col !== undefined
      ) {
        handleCellClick(e.target);
      }
    });
  
    document.addEventListener("mouseup", () => {
      isMouseDown = false;
    });
  
    function handleCellClick(cell) {
      const row = parseInt(cell.dataset.row);
      const col = parseInt(cell.dataset.col);
  
      if (!startNode) {
        cell.classList.add("start");
        startNode = { row, col, element: cell };
      } else if (!endNode && cell !== startNode.element) {
        cell.classList.add("end");
        endNode = { row, col, element: cell };
      } else if (cell !== startNode.element && cell !== endNode.element) {
        cell.classList.toggle("wall");
      }
    }
  
    startBtn.addEventListener("click", () => {
      if (startNode && endNode) {
        const path = dijkstra(startNode, endNode);
        if (path) {
          animatePath(path);
        }
      }
    });
  
    clearBtn.addEventListener("click", () => {
      startNode = null;
      endNode = null;
      grid.querySelectorAll("div").forEach((cell) => {
        cell.className = "";
      });
    });
  
    function dijkstra(start, end) {
      const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
      ];
  
      const distance = Array.from({ length: numRows }, () =>
        Array(numCols).fill(Infinity)
      );
      const visited = Array.from({ length: numRows }, () =>
        Array(numCols).fill(false)
      );
      const previous = Array.from({ length: numRows }, () =>
        Array(numCols).fill(null)
      );
  
      const priorityQueue = [{ node: start, dist: 0 }];
      distance[start.row][start.col] = 0;
  
      while (priorityQueue.length > 0) {
        priorityQueue.sort((a, b) => a.dist - b.dist);
        const { node, dist } = priorityQueue.shift();
  
        if (visited[node.row][node.col]) continue;
        visited[node.row][node.col] = true;
  
        if (node.row === end.row && node.col === end.col) {
          const path = [];
          let currentNode = end;
          while (currentNode) {
            path.unshift(currentNode);
            currentNode = previous[currentNode.row][currentNode.col];
          }
          return path;
        }
  
        for (const direction of directions) {
          const newRow = node.row + direction.row;
          const newCol = node.col + direction.col;
  
          if (
            newRow >= 0 &&
            newRow < numRows &&
            newCol >= 0 &&
            newCol < numCols &&
            !visited[newRow][newCol] &&
            !grid
              .querySelector(`[data-row='${newRow}'][data-col='${newCol}']`)
              .classList.contains("wall")
          ) {
            const newDist = dist + 1;
            if (newDist < distance[newRow][newCol]) {
              distance[newRow][newCol] = newDist;
              previous[newRow][newCol] = node;
              priorityQueue.push({
                node: {
                  row: newRow,
                  col: newCol,
                  element: grid.querySelector(
                    `[data-row='${newRow}'][data-col='${newCol}']`
                  ),
                },
                dist: newDist,
              });
            }
          }
        }
      }
      return null;
    }
  
    function animatePath(path) {
      path.forEach((node, index) => {
        setTimeout(() => {
          if (node !== startNode && node !== endNode) {
            node.element.classList.add("path");
          }
        }, 50 * index);
      });
    }
  });