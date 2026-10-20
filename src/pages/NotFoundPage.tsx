import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className='text-center p-50'>
      <h1>404 - Página Não Encontrada</h1>
      <p>Desculpe, a página que você está procurando não existe.</p>
      <Link to="/">
        <Button className='mt-4' variant="outline" >
          Voltar para a Página Inicial
        </Button>
      </Link>

    </div>
  );
}

export default NotFoundPage