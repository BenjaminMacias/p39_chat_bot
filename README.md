# p39_chat_bot

Chatbot en **Python 3.9** (p39) listo para entrenar con *intents* y usarlo vía **CLI** o **API**. Ideal para practicar PLN básico (tokenización, bolsa de palabras) y un flujo completo: entrenar → guardar modelo → inferencia.

---

## 🧠 Descripción

- Entrenamiento a partir de un archivo de **intents** (patrones → respuestas).
- Pipeline clásico: **tokenización**, **stemming/lemmatización**, **bolsa de palabras / TF-IDF** y **clasificador** (por ejemplo `scikit-learn`).
- Dos formas de uso:
  - **CLI**: conversa desde la terminal.
  - **API** (Flask/FastAPI): expón un endpoint `POST /predict` para integrar con web o apps.

> *Si tu repo ya incluye scripts/nombres distintos a los de abajo, solo reemplázalos por los que tengas.*

---

## 🧰 Tecnologías

- **Python 3.9** (recomendado)
- **NLTK** / **spaCy** (tokenización y limpieza)
- **scikit-learn** (vectorización y modelo)
- **Flask** o **FastAPI** (API)
- **joblib** / **pickle** (persistencia del modelo)

---

## 📦 Instalación

Clona el repo y crea un entorno virtual.

**Linux/Mac:**
```bash
git clone https://github.com/BenjaminMacias/p39_chat_bot.git
cd p39_chat_bot
python3.9 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
Windows (PowerShell):

powershell
Copiar
Editar
git clone https://github.com/BenjaminMacias/p39_chat_bot.git
cd p39_chat_bot
py -3.9 -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Si usas NLTK, al primer arranque quizá necesites descargar recursos:

python
Copiar
Editar
import nltk
nltk.download('punkt')
🏋️ Entrenamiento
Asumiendo un archivo de intents en data/intents.json:

bash
Copiar
Editar
python train.py --data data/intents.json --out models/chatbot.pkl
Parámetros típicos:

--data: ruta al JSON de intents.

--out: archivo donde se guardará el modelo/vectorizador.

Ejemplo de intents.json (simplificado):

json
Copiar
Editar
{
  "intents": [
    {
      "tag": "saludo",
      "patterns": ["hola", "buen día", "qué tal"],
      "responses": ["¡Hola!", "Hola, ¿en qué te ayudo?"]
    },
    {
      "tag": "despedida",
      "patterns": ["adiós", "nos vemos"],
      "responses": ["¡Hasta luego!", "¡Nos vemos!"]
    }
  ]
}
💬 Uso en CLI
bash
Copiar
Editar
python chat.py --model models/chatbot.pkl
Salida esperada:

makefile
Copiar
Editar
> hola
Bot: ¡Hola! ¿En qué te ayudo?
> adiós
Bot: ¡Hasta luego!
🌐 Uso vía API
Opción Flask
bash
Copiar
Editar
python api.py --model models/chatbot.pkl --host 0.0.0.0 --port 8000
Solicitud de ejemplo:

bash
Copiar
Editar
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"message":"hola"}'
Respuesta:

json
Copiar
Editar
{
  "intent": "saludo",
  "confidence": 0.92,
  "response": "¡Hola!"
}
Opción FastAPI (si tu repo la usa)
bash
Copiar
Editar
uvicorn api:app --host 0.0.0.0 --port 8000 --reload
🧪 Ejemplo de uso (desde Python)
python
Copiar
Editar
from bot import ChatBot  # ajusta al módulo/clase real

bot = ChatBot.load("models/chatbot.pkl")
print(bot.predict("hola"))      # -> intent, score
print(bot.reply("hola"))        # -> respuesta de texto
📁 Estructura sugerida
css
Copiar
Editar
p39_chat_bot/
├─ data/
│  └─ intents.json
├─ models/
│  └─ chatbot.pkl
├─ src/ (opcional si separas paquetes)
├─ train.py
├─ chat.py
├─ api.py
├─ requirements.txt
└─ README.md
🔧 Troubleshooting
No encuentra recursos de NLTK: ejecuta en Python:

python
Copiar
Editar
import nltk
nltk.download('punkt')
El modelo no carga: asegúrate de que train.py y chat.py/api.py usan el mismo formato (joblib/pickle) y versión de librerías compatibles.

CORS en API: si vas a consumir desde un front, activa CORS en Flask/FastAPI.

📝 Licencia
MIT (o la que prefieras).

makefile
Copiar
Editar
::contentReference[oaicite:0]{index=0}
