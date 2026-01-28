"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export function ShareButton({ teams }: { teams: any[][] }) {
  const formatTeamsForShare = () => {
    let text = "🚀 *TIMES DA PELADA DEFINIDOS!* ⚽\n\n";
    
    teams.forEach((team, index) => {
      text += `*TIME ${index + 1}*\n`;
      team.forEach(p => {
        text += `- ${p.name}\n`;
      });
      text += "\n";
    });
    
    text += "_Gerado pelo Futelera App_";
    return text;
  };

  const handleShare = async () => {
    const text = formatTeamsForShare();
    
    // Tenta usar a API de compartilhamento nativa (celular)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Times da Pelada',
          text: text,
        });
      } catch (err) {
        console.log('Erro ao compartilhar', err);
      }
    } else {
      // Fallback para link direto do WhatsApp
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
    }
  };

  return (
    <Button 
      onClick={handleShare}
      className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-xl"
    >
      <Share2 className="mr-2 h-5 w-5" /> Compartilhar no Zap
    </Button>
  );
}