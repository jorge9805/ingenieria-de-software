export default function Register() {
    return (
      <form className="form">
        <h2>Registro</h2>
        <input type="text" placeholder="Nombre" />
        <input type="email" placeholder="Correo" />
        <input type="password" placeholder="Contraseña" />
        <button>Registrar</button>
      </form>
    )
  }