import React from 'react';

class Fiabilidad extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error capturado en Fiabilidad:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Algo salió mal en Evolution Fit.</h2>
          <button onClick={() => window.location.reload()}>Recargar página</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default Fiabilidad;