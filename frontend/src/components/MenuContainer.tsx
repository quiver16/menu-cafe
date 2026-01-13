import React, { useState, useEffect } from 'react';
import api
    from '../../config/axios';
const ListaCategorias = () => {
    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        api.get('http://localhost:4000/categories')
            .then(res => {
                setCategorias(res.data);
            });
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Categorías del Minimarket</h1>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto' }}>
                {categorias.map(cat => (
                    <button
                        key={cat.Categoria}
                        style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
                    >
                        {cat.Descrip}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ListaCategorias;