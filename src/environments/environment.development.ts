export const environment = {
  production: false,
  assets: 'https://pruebasassets.portaloas.udistrital.edu.co/',
  apiUrl: 'http://localhost:4208/',
  PARAMETROS_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8510/v1/',
  SGA_MID_SERVICE: 'http://pruebasapi.intranetoas.udistrital.edu.co:8119/v1/',
  NUXEO_SERVICE:'https://autenticacion.portaloas.udistrital.edu.co/apioas/gestor_documental_mid/v1',
  PSE_SERVICE: 'https://pruebasfuncionarios.portaloas.udistrital.edu.co/botonPago/index.php?',
  TERCEROS_SERVICE: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/terceros_crud/v1/',
  TOKEN: {
    AUTORIZATION_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oauth2/authorize',
    CLIENTE_ID: 'e36v1MPQk2jbz9KM4SmKhk8Cyw0a',
    RESPONSE_TYPE: 'id_token token',
    SCOPE: 'openid email role documento',
    REDIRECT_URL: 'http://localhost:4200/',
    SIGN_OUT_URL: 'https://autenticacion.portaloas.udistrital.edu.co/oidc/logout',
    SIGN_OUT_REDIRECT_URL: 'http://localhost:4200/',
    AUTENTICACION_MID: 'https://autenticacion.portaloas.udistrital.edu.co/apioas/autenticacion_mid/v1/token/userRol',
  }
};
