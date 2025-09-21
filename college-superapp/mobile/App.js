import React, { useState } from 'react';
import { SafeAreaView, Text, Button } from 'react-native';

const API = process.env.EXPO_PUBLIC_API || 'http://localhost:8080';

export default function App() {
  const [token, setToken] = useState(null);
  const [summary, setSummary] = useState(null);

  const login = async () => {
    const r = await fetch(`${API}/auth/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'student1' })
    });
    const j = await r.json();
    setToken(j.token);
  };
  const load = async () => {
    const r = await fetch(`${API}/student/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setSummary(await r.json());
  };

  return (
    <SafeAreaView style={{ padding: 24 }}>
      <Text>College SuperApp</Text>
      {!token ? <Button title="Login" onPress={login} /> : <Button title="Load Summary" onPress={load} />}
      {summary && <Text>{JSON.stringify(summary)}</Text>}
    </SafeAreaView>
  );
}
