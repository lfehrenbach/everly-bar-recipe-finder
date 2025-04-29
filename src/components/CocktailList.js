'use client'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function CocktailList() {
  const [cocktails, setCocktails] = useState([])
  const [batches, setBatches] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { data: cocktailData, error: cocktailError } = await supabase.from('cocktails').select('*')
      const { data: batchData, error: batchError } = await supabase.from('batches').select('*')

      if (cocktailError) console.error('❌ Cocktail error:', cocktailError)
      else setCocktails(cocktailData)

      if (batchError) console.error('❌ Batch error:', batchError)
      else setBatches(batchData)
    }

    fetchData()
  }, [])

  return (
    <div>
      <h2>🍸 Cocktails</h2>
      <ul>
        {cocktails.map(c => (
          <li key={c.id}><strong>{c.name}</strong>: {c.ingredients?.join(', ')}</li>
        ))}
      </ul>

      <h2>🧪 Batches</h2>
      <ul>
        {batches.map(b => (
          <li key={b.id}><strong>{b.name}</strong>: {b.ingredients?.join(', ')}</li>
        ))}
      </ul>
    </div>
  )
}

