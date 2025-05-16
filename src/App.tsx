// Criando Mundos - Versão com Senha de Acesso (React + Tailwind + LocalStorage)
import { useEffect, useState } from 'react';

export default function CriandoMundos() {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [role, setRole] = useState('none');
  const [file, setFile] = useState(null);
  const [uploadLink, setUploadLink] = useState('');
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState({});

  useEffect(() => {
    const savedPosts = localStorage.getItem('criandoMundos_posts');
    const savedLikes = localStorage.getItem('criandoMundos_likes');
    if (savedPosts) setPosts(JSON.parse(savedPosts));
    if (savedLikes) setLikes(JSON.parse(savedLikes));
  }, []);

  useEffect(() => {
    localStorage.setItem('criandoMundos_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('criandoMundos_likes', JSON.stringify(likes));
  }, [likes]);

  const handleLogin = () => {
    if (password !== 'mundos2024') {
      alert('Senha incorreta');
      return;
    }
    if (code === '1510') setRole('professor');
    else if (code.startsWith('GRP')) setRole('aluno');
    else alert('Código inválido');
    setAuthenticated(true);
  };

  const handleUpload = () => {
    if (file || uploadLink) {
      const newPost = {
        id: Date.now().toString(),
        name: file?.name || 'Link compartilhado',
        url: file ? URL.createObjectURL(file) : uploadLink,
        likes: 0
      };
      setPosts([...posts, newPost]);
      setFile(null);
      setUploadLink('');
    }
  };

  const handleLike = (id) => {
    const updatedLikes = { ...likes, [id]: (likes[id] || 0) + 1 };
    setLikes(updatedLikes);
    setPosts(posts.map(p => p.id === id ? { ...p, likes: updatedLikes[id] } : p));
  };

  return (
    <div className="min-h-screen p-4 bg-purple-50">
      <h1 className="text-3xl text-center font-bold text-purple-700 mb-6">Criando Mundos</h1>

      {!authenticated && (
        <div className="max-w-md mx-auto bg-white p-4 rounded shadow space-y-2">
          <input
            className="w-full p-2 border"
            placeholder="Digite o código de acesso (ex: 1510 ou GRP001)"
            value={code}
            onChange={e => setCode(e.target.value)}
          />
          <input
            type="password"
            className="w-full p-2 border"
            placeholder="Senha de acesso"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} className="w-full bg-purple-600 text-white py-2 rounded">
            Entrar
          </button>
        </div>
      )}

      {authenticated && role === 'professor' && (
        <div className="max-w-3xl mx-auto mt-6">
          <h2 className="text-xl font-semibold mb-2">Posts Recebidos</h2>
          {posts.map(post => (
            <div key={post.id} className="bg-white p-3 rounded shadow mb-2">
              <a href={post.url} target="_blank" className="text-purple-700 underline">{post.name}</a>
              <p className="text-sm text-gray-600">Curtidas: {post.likes}</p>
            </div>
          ))}
        </div>
      )}

      {authenticated && role === 'aluno' && (
        <div className="max-w-2xl mx-auto mt-6 space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <p className="mb-2 font-semibold">Enviar arquivo ou link</p>
            <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="mb-2 w-full" />
            <input type="text" placeholder="ou cole um link" value={uploadLink} onChange={e => setUploadLink(e.target.value)} className="mb-2 w-full p-2 border" />
            <button onClick={handleUpload} className="w-full bg-purple-600 text-white py-2 rounded">Enviar</button>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <p className="mb-2 font-semibold">Posts pelo Mundo</p>
            {posts.map(post => (
              <div key={post.id} className="flex justify-between items-center border-b py-2">
                <a href={post.url} target="_blank" className="text-purple-700 underline">{post.name}</a>
                <button onClick={() => handleLike(post.id)} className="text-sm text-purple-600">Curtir ({likes[post.id] || 0})</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}