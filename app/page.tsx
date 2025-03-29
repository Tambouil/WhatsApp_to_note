'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Copy } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [formattedMessage, setFormattedMessage] = useState('');

  const handleFormat = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = formData.get('message') as string;

    // Diviser le message par lignes
    const lines = message.split('\n');
    const formattedLines = [];

    for (const line of lines) {
      // Nettoyer chaque ligne
      let formattedLine = line.trim();
      
      // Supprimer les références [1][5] etc.
      formattedLine = formattedLine.replace(/\[\d+\]/g, '');
      
      // Supprimer les dates WhatsApp et les noms qui suivent
      formattedLine = formattedLine.replace(/\[\d{2}\/\d{2}\s\d{2}:\d{2}\]\s[^:]+:\s/, '');
      
      // Ajouter la ligne si elle n'est pas vide
      if (formattedLine) {
        formattedLines.push(formattedLine);
      }
    }

    setFormattedMessage(formattedLines.join('\n'));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedMessage);
    toast.success('Le message a été copié avec succès.');
  };

  return (
    <div className="min-h-screen p-4 flex gap-4 items-center flex-col justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>WhatsappToNote</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormat} className="space-y-4">
            <Textarea name="message" placeholder="Entrez votre message" className="min-h-32" />
            <Button className="w-full">Formater</Button>
          </form>
        </CardContent>
      </Card>
      {formattedMessage.length > 1 && (
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Résultat</CardTitle>
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="w-6 h-6" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="whitespace-pre-wrap">{formattedMessage}</CardContent>
        </Card>
      )}
    </div>
  );
}
