// CHATBOT CON TENSORFLOW.JS + COMENTARIOS PROFESIONALES
// Datos de entrenamiento iniciales (simulación de ratings de usuarios a productos)
const userData = [
    { userId: 1, productId: 101, rating: 5 },
    { userId: 1, productId: 102, rating: 3 },
    { userId: 2, productId: 101, rating: 4 },
    { userId: 2, productId: 103, rating: 2 },
    { userId: 3, productId: 104, rating: 3 },
  ];
  
  // Convertimos los datos a tensores (estructura de datos de IA)
  // Cada fila representa: [userId, productId]
  const userTensor = tf.tensor2d(
    userData.map(item => [item.userId, item.productId]),
    [userData.length, 2]
  );
  
  // Tensor de ratings (lo que queremos que el modelo aprenda a predecir)
  const ratingTensor = tf.tensor2d(
    userData.map(item => [item.rating]),
    [userData.length, 1]
  );
  
  // Variable global para el modelo de IA
  let model;
  

  // FUNCIONES PARA MANEJAR EL MODELO
  // Carga un modelo desde LocalStorage si existe, o entrena uno nuevo
  async function loadOrCreateModel() {
    try {
      model = await tf.loadLayersModel('localstorage://chatbot-model');
      console.log('✅ Modelo cargado exitosamente de LocalStorage.');
    } catch (error) {
      console.log('⚠️ No se encontró un modelo guardado. Creando y entrenando uno nuevo...');
  
      // Crear modelo secuencial (capa densa -> capa de salida)
      model = tf.sequential(); //Se crea un modelo secuencial en TensorFlow.js.  se agregan una tras otra, de forma lineal.
      model.add(tf.layers.dense({ units: 50, activation: 'relu', inputShape: [2] })); //dense: agrega una capa densa (fully connected, todos los nodos se conectan a todos). units: 50: esta capa tiene 50 neuronas. activation: 'relu': cada neurona usa la función de activación ReLU (Rectified Linear Unit), que transforma las salidas como max(0, x). inputShape: [2]: espera 2 valores como entrada por cada dato (en tu caso, usuario y producto).
      model.add(tf.layers.dense({ units: 1 })); //Agrega otra capa densa. units: 1: solo una neurona de salida, se quiere predecir un solo valor (el rating). No especifica activación, entonces es lineal por defecto.
  
      model.compile({ optimizer: 'adam', loss: 'meanSquaredError' }); //Prepara el modelo para entrenarlo. optimizer: 'adam': usa el optimizador Adam, que ajusta los pesos eficientemente. loss: 'meanSquaredError': la función de pérdida será el error cuadrático medio (MSE)
  
      // Entrenar modelo con los tensores
      await model.fit(userTensor, ratingTensor, { //entrena el modelo usando los datos de entrada (userTensor) y las etiquetas reales (ratingTensor).
        epochs: 10, //hará 10 pasadas completas por todos los datos de entrenamiento.
        callbacks: { // después de cada época, ejecutará una función que imprime el número de época (epoch) y la pérdida (logs.loss) en la consola. Esto te permite ver si el modelo está mejorando.
          onEpochEnd: (epoch, logs) => {
            console.log(`Epoch ${epoch}: loss = ${logs.loss}`);
          }
        }
      });
  
      // Guardar el modelo entrenado en LocalStorage
      await model.save('localstorage://chatbot-model');
      console.log('✅ Modelo nuevo entrenado y guardado en LocalStorage.');
    }
  }
  
  // Iniciar cargando o creando el modelo
  loadOrCreateModel();
  
  // --------------------------------------------------------
  // RESPUESTAS DEL CHATBOT
  // --------------------------------------------------------
  
  // Diccionario de respuestas predefinidas para las conversaciones
  const responses = {
    'hola': '¡Hola! ¿Cómo estás hoy?',
    'bien, ¿y tú?': 'Estoy muy bien, gracias por preguntar. 😊 ¿En qué puedo ayudarte?',
    '¿qué puedes hacer?': 'Puedo platicar contigo, responder preguntas básicas y recomendarte productos.',
    '¿qué productos recomiendas?': '¡Puedo hacerte una recomendación personalizada si quieres! Solo dime "recomiéndame".',
    'recomiéndame algo': 'Basándome en tus gustos, tengo una recomendación especial para ti. 😉',
    '¿cómo sabes mis gustos?': 'Uso un pequeño modelo de inteligencia artificial que aprende de tus preferencias.',
    '¿qué es inteligencia artificial?': 'Es la habilidad de una máquina para realizar tareas que normalmente requieren inteligencia humana. 🤖',
    '¿usas inteligencia artificial?': '¡Sí! Aprendo de tus mensajes para darte mejores respuestas y sugerencias.',
    '¿me puedes ayudar a elegir un regalo?': 'Claro que sí, ¿para quién es el regalo? 🎁',
    'es para mi mamá': '¡Qué bonito detalle! ❤️ ¿Qué tipo de cosas le gustan a tu mamá? (ejemplo: perfumes, libros, ropa)',
    'le gustan los perfumes': 'Perfecto, te puedo recomendar perfumes florales o frescos que son muy populares.',
    '¿cuál perfume recomiendas?': 'Te recomendaría un aroma floral suave, como un perfume de jazmín o rosas. 🌸',
    'gracias': '¡De nada! Estoy aquí para ayudarte. ¿Algo más en lo que pueda apoyarte?',
    'sí, ¿qué más puedes hacer?': 'Además de recomendar, puedo conversar contigo sobre música, películas o hobbies. 🎵🎬✨',
    'hablemos de música': '¡Me encanta la música! ¿Qué género te gusta más?',
    'pop': 'El pop tiene canciones súper pegajosas. ¿Te gusta algún artista en especial? 🎤',
    'sí, taylor swift': '¡Taylor Swift es increíble! 🦋 ¿Tienes alguna canción favorita de ella?',
    'love story': '¡"Love Story" es todo un clásico romántico! 💖 ¿Quieres que te recomiende más canciones parecidas?',
    'sí, por favor': 'Claro, te recomiendo escuchar "You Belong With Me" y "Enchanted". Son hermosas. ✨',
    'adiós': '¡Hasta luego! Que tengas un día maravilloso. 🌟 ¡Espero verte pronto aquí!',
  };
  
  // --------------------------------------------------------
  // MANEJO DEL CHAT EN LA PÁGINA
  // --------------------------------------------------------
  
  // Obtener referencias a los elementos HTML
  const chatContainer = document.getElementById('chat-container');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const resetButton = document.getElementById('reset-button');
  
  // Escuchar eventos del botón Enviar y la tecla Enter
  sendButton.addEventListener('click', handleUserMessage);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleUserMessage();
    }
  });
  
  // Escuchar evento del botón Resetear modelo
  resetButton.addEventListener('click', resetModel);
  
  // Función principal que maneja los mensajes del usuario
  async function handleUserMessage() {
    const message = userInput.value.toLowerCase().trim();
    if (message === '') return;
  
    appendMessage('user', message); // Mostrar mensaje del usuario en el chat
    userInput.value = '';
  
    if (responses[message]) {
      appendMessage('bot', responses[message]); // Si hay respuesta predefinida
    } else if (message.includes('recomiéndame')) {
      const recommendation = await generateRecommendation(1, 102); // Predicción IA
      appendMessage('bot', `Basado en tu historial, te recomiendo un producto con una puntuación estimada de ${recommendation.toFixed(2)}.`);
    } else {
      appendMessage('bot', 'No entendí tu mensaje. ¿Puedes intentar con otra pregunta o pedir una recomendación? 🤔');
    }
  }
  
  // Función para agregar un mensaje al contenedor de chat
  function appendMessage(sender, text) {
    const messageElem = document.createElement('div');
    messageElem.classList.add('message', sender);
    messageElem.innerText = text;
    chatContainer.appendChild(messageElem);
    chatContainer.scrollTop = chatContainer.scrollHeight; // Hacer scroll automático
  }
  
  // --------------------------------------------------------
  // FUNCIONES DEL MODELO
  // --------------------------------------------------------
  
  // Generar una predicción de calificación para un usuario y producto
  async function generateRecommendation(userId, productId) {
    if (!model) {
      console.log('El modelo aún no está cargado.');
      return 0;
    }
    const newUserInput = tf.tensor2d([[userId, productId]]);
    const prediction = model.predict(newUserInput);
    const predictedValue = (await prediction.array())[0][0];
    return predictedValue;
  }
  
  // Función para borrar el modelo guardado en LocalStorage
  async function resetModel() {
    try {
      await tf.io.removeModel('localstorage://chatbot-model');
      console.log('🗑️ Modelo eliminado exitosamente.');
      alert('Modelo eliminado. Se entrenará uno nuevo al recargar la página.');
    } catch (error) {
      console.error('Error al eliminar el modelo:', error);
      alert('Hubo un problema al eliminar el modelo.');
    }
  }
  