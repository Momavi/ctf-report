import { useState } from "react";
import axios from "axios";
import "./Form.css"; // Импорт файла стилей
import { FileUploader } from "react-drag-drop-files";

export default function Form() {
  // Состояние для хранения номера варианта и отчета
  const [variant, setVariant] = useState(1);

  // Состояние для хранения ошибок и сообщений
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const fileTypes = ["DOCX", "TXT", "PDF"];
  const [report, setReport] = useState(null);
  const handleChangeFile = (file) => {
    setReport(file);
  };

  // Функция для обработки изменения полей ввода
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "variant") {
      setVariant(value);
    }
  };

  // Функция для обработки отправки формы
  const handleSubmit = async (e) => {
    console.log(report);
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
      const response = await axios.post("http://localhost:3000/upload", formData, {
        headers: {
          "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
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
    <div className="mainPage__wrapper">
      <div className="card">
        <h1>Отправка отчета</h1>
        <div className="card__wrapper">
          <div className="form">
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
            <div className="form-file">
              <FileUploader
                handleChange={handleChangeFile}
                name="report"
                classes="drop_zone"
                types={fileTypes}
                label="Загрузите или перетащите файл формата "
              />
            </div>
            <button onClick={handleSubmit}>Отправить</button>
          </div>
        </div>
        {error && <div className="error">{error}</div>}
        {message && <div className="message">{message}</div>}
      </div>
      <div className="additional">dd</div>
    </div>
  );
}
