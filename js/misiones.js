// misiones.js

const sistemaMisiones = {
    progresoMisiones: JSON.parse(localStorage.getItem('progresoMisiones')) || {
        victorias: 0,
        victoriasConsecutivas: 0,
        tiempoJugado: 0
    },

    actualizarProgreso(tipo, cantidad) {
        this.progresoMisiones[tipo] += cantidad;
        localStorage.setItem('progresoMisiones', JSON.stringify(this.progresoMisiones));
    },

    completarMision(tipo) {
        // Lógica para determinar si la misión está completada
        return this.progresoMisiones[tipo] >= 10; // Ejemplo: completada cuando alcanza 10
    },

    reiniciarMisiones() {
        this.progresoMisiones = {
            victorias: 0,
            victoriasConsecutivas: 0,
            tiempoJugado: 0
        };
        localStorage.setItem('progresoMisiones', JSON.stringify(this.progresoMisiones));
    }
};

export default sistemaMisiones;

  
  