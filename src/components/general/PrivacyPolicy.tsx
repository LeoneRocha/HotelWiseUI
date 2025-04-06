// src/components/PrivacyPolicy.tsx
import React from 'react';
import '../../css/PrivacyPolicy.css';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Política de Privacidade e Cookies</h1>
      <section>
        <h2 className="mb-3">Informações Gerais</h2>
        <p>
          Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais quando você usa nosso site. Ao utilizar nosso site, você concorda com a coleta e uso de informações de acordo com esta política.
        </p>
      </section>
      <section>
        <h2 className="mb-3">Coleta de Informações</h2>
        <p>
          Coletamos vários tipos de informações para diversas finalidades, a fim de fornecer e melhorar nosso serviço para você.
        </p>
        <ul>
          <li><strong>Informações Pessoais:</strong> Podem incluir, mas não estão limitadas a, nome, endereço de e-mail, número de telefone.</li>
          <li><strong>Dados de Uso:</strong> Podemos coletar informações sobre como o serviço é acessado e usado, incluindo, mas não se limitando a, informações sobre o seu navegador, endereço IP, páginas visitadas e outros dados diagnósticos.</li>
        </ul>
      </section>
      <section>
        <h2 className="mb-3">Uso de Informações</h2>
        <p>
          Usamos as informações coletadas para diversas finalidades:
        </p>
        <ul>
          <li>Para fornecer e manter o serviço</li>
          <li>Para notificá-lo sobre mudanças em nosso serviço</li>
          <li>Para permitir que você participe de funcionalidades interativas do nosso serviço quando optar por fazê-lo</li>
          <li>Para fornecer atendimento ao cliente e suporte</li>
          <li>Para fornecer análises ou informações valiosas para que possamos melhorar o serviço</li>
          <li>Para monitorar o uso do serviço</li>
          <li>Para detectar, prevenir e resolver problemas técnicos</li>
        </ul>
      </section>
      <section>
        <h2 className="mb-3">Cookies</h2>
        <p>
          Utilizamos cookies e tecnologias de rastreamento similares para rastrear a atividade em nosso serviço e manter certas informações.
        </p>
        <p>
          Cookies são arquivos com uma pequena quantidade de dados que podem incluir um identificador exclusivo anônimo. Os cookies são enviados para o seu navegador a partir de um site e armazenados no seu dispositivo.
        </p>
      </section>
      <section>
        <h2 className="mb-3">Segurança das Informações</h2>
        <p>
          A segurança das suas informações é importante para nós, mas lembre-se de que nenhum método de transmissão pela Internet ou método de armazenamento eletrônico é 100% seguro. Embora nos esforcemos para usar meios comercialmente aceitáveis para proteger suas informações pessoais, não podemos garantir sua segurança absoluta.
        </p>
      </section>
      <section>
        <h2 className="mb-3">Alterações a Esta Política de Privacidade</h2>
        <p>
          Podemos atualizar nossa Política de Privacidade de tempos em tempos. Notificaremos você de quaisquer alterações, publicando a nova Política de Privacidade nesta página. Recomendamos que você revise esta Política de Privacidade periodicamente para quaisquer alterações.
        </p>
      </section>
      <section>
        <h2 className="mb-3">Contato</h2>
        <p>
          Se você tiver alguma dúvida sobre esta Política de Privacidade, entre em contato conosco:
        </p>
        <p>Email: suporte@exemplo.com</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
