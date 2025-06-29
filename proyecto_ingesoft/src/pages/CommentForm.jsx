export default function CommentForm() {
  return (
    <form className="form">
      <h2>Comentar</h2>
      <input type="number" placeholder="Calificación (1-5)" min="1" max="5" />
      <textarea placeholder="Tu comentario..." rows={4}></textarea>
      <button>Enviar</button>
    </form>
  )
}