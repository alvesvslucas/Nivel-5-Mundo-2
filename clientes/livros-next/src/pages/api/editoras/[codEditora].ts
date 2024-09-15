import { NextApiRequest, NextApiResponse } from 'next';
import { controleEditora } from '.';

export default (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'GET') {
      const { codEditora } = req.query;
      const nomeEditora = controleEditora.getNomeEditora(Number(codEditora));
      res.status(200).json({ nome: nomeEditora });
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Método ${req.method} não permitido`);
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};
