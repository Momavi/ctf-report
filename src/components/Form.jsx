import { useState } from "react";
import axios from "axios";
import "./Form.css"; // Импорт файла стилей
import DragDrop from "./DragDrop";

export default function Form() {
  // Состояние для хранения номера варианта и отчета
  const [variant, setVariant] = useState(1);
  const [report, setReport] = useState(null);

  // Состояние для хранения ошибок и сообщений
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);


  // Функция для обработки изменения полей ввода
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "variant") {
      setVariant(value);
    } else if (name === "report") {
      setReport(files[0]);
    }
  };

  // Функция для обработки отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Проверка валидности номера варианта
    if (!variant || isNaN(variant) || variant < 1 || variant > 20) {
      setError("Введите корректный номер варианта от 1 до 20");
      return;
    }
    // Проверка наличия файла отчета
    if (!report) {
      setError("Выберите файл отчета для отправки");
      return;
    }

    // Очистка ошибок и сообщений
    setError(null);
    setMessage(null);
    // Создание объекта FormData для упаковки данных формы
    const formData = new FormData();
    formData.append("variant", variant);
    formData.append("report", report);
    // Отправка данных на сервер с помощью axios
    try {
      const response = await axios.post("/api/report", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // Получение результата от сервера
      const { status, data } = response;
      // Проверка статуса ответа
      if (status === 200) {
        // Успешная отправка
        setMessage(data.message);
        // Очистка полей ввода
        setVariant("");
        setReport(null);
      } else {
        // Ошибка на стороне сервера
        setError(data.error);
      }
    } catch (err) {
      // Ошибка на стороне клиента
      setError(err.message);
    }
  };

  return (
    <div className="license">
      <h1>Отправка отчета</h1>
      <div className="license__wrapper">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="variant">Номер варианта</label>
            <input
              type="number"
              id="variant"
              name="variant"
              value={variant}
              onChange={handleChange}
              min="1"
              max="20"
            />
          </div>
          <div className="form-group">
            <DragDrop />
          </div>
          <button type="submit">Отправить</button>
        </form>
      </div>
      {error && <div className="error">{error}</div>}
      {message && <div className="message">{message}</div>}
    </div>
  );
}
