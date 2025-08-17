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

