const contenedor = document.getElementById('card')

//toma un array y mediante un fragment crea las tarjetas que posea ese array
export function pintarTarjetas(array) {
    const fragment = document.createDocumentFragment();

    //este id permite en caso de busqueda de paramatros por texto que no concuerden, evite pintar 
    //tarjetas y enseñe el siguiente mensaje
    if (array.length === 0) {
        contenedor.innerHTML = `<h5 class="display-3">your search had no matches</h5>`
        return
    }

    //este forEach permite dibujar la cantidad de tarjetas que posea el array ingresado
    array.forEach(tarjeta => {
        const card = document.createElement('div')
        card.className = 'card shadow p-3 bg-body-tertiary rounded'
        card.style = 'width: 18rem;'
        card.innerHTML = `
            <img src="${tarjeta.image}" 
                class="card-img-top cajafotos" 
                alt="${tarjeta.category}">
            <div class="card-body d-flex flex-column justify-content-between flex-grow-1">
                <p class="card-text"><strong>${tarjeta.name}</strong></p>
                <p class="card-text">Description: ${tarjeta.description}</p>
                <p class="card-text">Category: ${tarjeta.category}</p>
                <p class="card-text">Place: ${tarjeta.place}</p>
                <div class="card-footer d-flex justify-content-center align-items-end mt-auto">
                    <a href="../pages/details.html?id=${tarjeta._id}" class="btn btn-primary">More Info</a>
                </div>
            </div>`

        fragment.appendChild(card)
    });

    contenedor.innerHTML = ''
    contenedor.appendChild(fragment)
}

//esta funcion permite buscar el texto ingresado en el input y compararlo con los datos de array de las tarjetas
export function filtrarPorTexto(array, texto) {
    let arrayFiltrado = array.filter(elemento => elemento.name.toLowerCase().includes(texto.toLowerCase()))
    return arrayFiltrado
}

//esta funcion permite buscar por categorias seleccionadas y compararlas con las categorias de las tarjetas 
export function filtrarCategoria(array) {
    const checkboxes = document.querySelectorAll("input[type='checkbox']:checked")
    const checkedValues = Array.from(checkboxes).map(checkbox => checkbox.value)
    return checkedValues.length > 0 ? array.filter(elemento => checkedValues.includes(elemento.category)) : array
}

//esta funcion permite encontrar la asistencia de mayor porcentaje de un array, toma como valor base de comparacion el 0
export function highestAttendancePercentage(evento) {
    let highestAttendancePercentage = 0
    let eventWithHighestAttendancePercentage = null;
    for (let i = 0; i < evento.length; i++) {
        const attendancePercentage = ((evento[i].assistance || evento[i].estimate) / evento[i].capacity) * 100
        if (attendancePercentage > highestAttendancePercentage) {
            highestAttendancePercentage = attendancePercentage
            eventWithHighestAttendancePercentage = evento[i];
        }
    }
    return eventWithHighestAttendancePercentage
}

//esta funcion permite encontrar la asistencia de menor porcenate de un array, toma como valor de 
//comparacion la variable Infinity, permitiendo que el primer valor que lea sea menor y pueda ir 
//actualizando correctamente
export function lowestAssistancePercentage(evento) {
    let lowestAssistancePercentage = Infinity
    let eventWithLowestAttendancePercentage = null
    for (let i = 0; i < evento.length; i++) {
        const assistancePercentage = ((evento[i].assistance || evento[i].estimate) / evento[i].capacity) * 100
        if (assistancePercentage < lowestAssistancePercentage) {
            lowestAssistancePercentage = assistancePercentage
            eventWithLowestAttendancePercentage = evento[i]
        }
    }
    return eventWithLowestAttendancePercentage;
}

//esta funcion permite encontrar el valor maximo dentro de un array, utiliza find para encontrar el 
//valor y la operacion Math.max para encotrar ese valor maximo del array
export function findMaxCapacityEvent(evento) {
    return evento.find(event => event.capacity === Math.max(...evento.map(event => event.capacity)))
}

//esta funcion permite crear un array de objetos que contienen categorias, ganancias y porcentajes.
//primero creamos la funcion stats que toma un array datos
//segundo utilizamos reduce para formar un objeto con los resultados que se van acumulando en cada iteracion
export function stats(datos) {
    const resultado = datos.reduce((resultado, dato) => {
      const categoria = dato.category
      // Si la categoría no existe en el objeto resultado, agregarla y establecer sus valores iniciales a cero
      if (!resultado.categorias.includes(categoria)) {
        resultado.categorias.push(categoria)
        resultado.ganancias[categoria] = 0
        resultado.attendance[categoria] = 0
        resultado.capacidad[categoria] = 0
      }
      // Obtener el valor de asistencia, que puede ser dato.assistance o dato.estimate si dato.assistance es nulo o no está definido
      const attendances = dato.assistance ?? dato.estimate
      // Agregar la cantidad de ganancias, asistencia y capacidad a la categoría correspondiente
      resultado.ganancias[categoria] += dato.price * attendances
      resultado.attendance[categoria] += attendances
      resultado.capacidad[categoria] += dato.capacity
      
      return resultado
    }, { categorias: [], ganancias: {}, porcentajes: {}, attendance: {}, capacidad: {} })
  
    // Calcular los porcentajes de asistencia para cada categoría y los agrega a la propiedad porcentaje
    resultado.categorias.forEach(categoria => {
      resultado.porcentajes[categoria] = resultado.attendance[categoria] / resultado.capacidad[categoria] * 100
    })
    return resultado
  }

//esta funcion llena la tabla de stats, tanto para eventos pasados como futuros
export function pintarFilas(dato, contenedor) {
    let filas = ''
    dato.categorias.forEach(categoria => {
        filas += `
        <tr>
        <td>${categoria}</td>
        <td>$ ${dato.ganancias[categoria].toFixed(2)}</td>
        <td>${dato.porcentajes[categoria].toFixed(2)} %</td>
        </tr>`
    })
    contenedor.innerHTML = filas
}



















/*
export function calcPercentageAssistanceOrEstimate(array) {
    let assistances = 0
    let capacitys = 0
    array.forEach(event => {
        capacitys += event.capacity
        assistances += event.assistance ? event.assistance : event.estimate
    })
    return ((assistances / capacitys) * 100)
}
 
export function calcReveneus(array) {
    let assistances = 0
    let prices = 0
    array.forEach(event => {
        prices += event.price
        assistances += event.assistance ? event.assistance : event.estimate
    })
    return (assistances * prices)
}
 
export function calculateMetricsByCategory(array) {
  const categories = {};
  array.forEach(event => {
    if (!categories[event.category]) {
      categories[event.category] = {
        capacity: event.capacity,
        assistance: event.assistance,
        estimate: event.estimate,
        price: event.price
      };
    } else {
      categories[event.category].capacity += event.capacity
      categories[event.category].assistance += event.assistance
      categories[event.category].estimate += event.estimate
      categories[event.category].price += event.price
    }
  });
  for (const category in categories) {
    const metrics = categories[category]
    metrics.percentageAssistance = calcPercentageAssistanceOrEstimate([metrics])
    metrics.revenues = calcReveneus([metrics])
  }
  return categories;
}
*/