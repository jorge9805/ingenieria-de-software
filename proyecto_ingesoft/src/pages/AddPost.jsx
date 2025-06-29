export default function AddPost() {
    return (
      <form className="form">
        <h2>Nuevo Post</h2>
        <input type="text" placeholder="Nombre del lugar" />
        <textarea placeholder="Descripción completa..." rows={5}></textarea>
        <input type="url" placeholder="URL de la imagen" />
        <button>Publicar</button>
      </form>
    )
  }