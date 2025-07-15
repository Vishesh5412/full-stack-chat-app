export default async function handler(req, res) {
  const userId = req.headers['x-user-id'];

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  };

  res.status(200).json({ message: 'Authorized', userId });
}

