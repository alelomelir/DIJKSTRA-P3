import java.util.*;

public class DijkstraMaze {
    static int[][] laberinto = {
            { 0, 1, 0, 0, 0, 0 },
            { 0, 1, 0, 1, 1, 0 },
            { 0, 0, 0, 1, 0, 0 },
            { 0, 1, 1, 1, 0, 1 },
            { 0, 0, 0, 0, 0, 0 },
            { 1, 1, 1, 1, 1, 0 }
    };

    public static List<int[]> obtenerVecinos(int[][] laberinto, int[] nodo) {
        List<int[]> vecinos = new ArrayList<>();
        int[][] direcciones = { { -1, 0 }, { 1, 0 }, { 0, -1 }, { 0, 1 } };

        for (int[] direccion : direcciones) {
            int[] vecino = { nodo[0] + direccion[0], nodo[1] + direccion[1] };
            if (vecino[0] >= 0 && vecino[0] < laberinto.length &&
                    vecino[1] >= 0 && vecino[1] < laberinto[0].length) {
                if (laberinto[vecino[0]][vecino[1]] == 0) {
                    vecinos.add(vecino);
                }
            }
        }
        return vecinos;
    }

    public static List<int[]> dijkstra(int[][] laberinto, int[] inicio, int[] fin) {
        int filas = laberinto.length;
        int columnas = laberinto[0].length;
        int[][] distancias = new int[filas][columnas];
        for (int i = 0; i < filas; i++) {
            Arrays.fill(distancias[i], Integer.MAX_VALUE);
        }
        distancias[inicio[0]][inicio[1]] = 0;

        PriorityQueue<int[]> colaPrioridad = new PriorityQueue<>(
                Comparator.comparingInt(nodo -> distancias[nodo[0]][nodo[1]]));
        colaPrioridad.add(inicio);
        Map<int[], int[]> prev = new HashMap<>();
        prev.put(inicio, null);

        while (!colaPrioridad.isEmpty()) {
            int[] nodoActual = colaPrioridad.poll();

            if (Arrays.equals(nodoActual, fin)) {
                break;
            }

            for (int[] vecino : obtenerVecinos(laberinto, nodoActual)) {
                int nuevaDistancia = distancias[nodoActual[0]][nodoActual[1]] + 1;
                if (nuevaDistancia < distancias[vecino[0]][vecino[1]]) {
                    distancias[vecino[0]][vecino[1]] = nuevaDistancia;
                    prev.put(vecino, nodoActual);
                    colaPrioridad.add(vecino);
                }
            }
        }

        List<int[]> camino = new ArrayList<>();
        int[] paso = fin;
        while (paso != null) {
            camino.add(paso);
            paso = prev.get(paso);
        }
        Collections.reverse(camino);
        return camino;
    }

    public static void main(String[] args) {
        int[] inicio = { 2, 2 };
        int[] fin = { 5, 5 };
        List<int[]> camino = dijkstra(laberinto, inicio, fin);

        int[][] laberintoVisual = new int[laberinto.length][laberinto[0].length];
        for (int i = 0; i < laberinto.length; i++) {
            for (int j = 0; j < laberinto[0].length; j++) {
                laberintoVisual[i][j] = laberinto[i][j];
            }
        }

        for (int[] nodo : camino) {
            laberintoVisual[nodo[0]][nodo[1]] = 2;
        }

        // Visualización (opcional)
        for (int i = 0; i < laberintoVisual.length; i++) {
            for (int j = 0; j < laberintoVisual[0].length; j++) {
                if (laberintoVisual[i][j] == 0) {
                    System.out.print(" ");
                } else if (laberintoVisual[i][j] == 1) {
                    System.out.print("#");
                } else if (laberintoVisual[i][j] == 2) {
                    System.out.print(".");
                }
            }
            System.out.println();
        }
    }
}
