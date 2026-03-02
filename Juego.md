> 🃏 **AI-Gi-Oh! : The AGI Wars** *(Nom en clau del projecte)*
>
> ## 📖 La Història *(El Lore)*
> Som a l'any **2030**. La cursa per aconseguir la **Intel·ligència Artificial General (AGI)** ha fracturat el ciberespai en tres grans faccions: **Les Megacorporacions (Big Tech)**, **la Resistència Open Source**, i **els Sindicalistes de l'Automatització (No-Code)**.  
> Com a **"Prompt Master"**, el teu objectiu és conquerir els **Servidors Centrals (The Core)**. Per fer-ho, invoques les entitats digitals més poderoses del món *(models d'IA)*, defenses el teu codi amb eines d'automatització i modifiques l'entorn amb infraestructures al núvol.  
> **El primer que destrueixi els servidors del rival, es queda amb l'AGI.**
>
> ## ⚙️ Les Bases del Joc *(Estil Yu-Gi-Oh!)*
> El tauler té espais definits i els jugadors tenen **Punts de Vida (HP)**. Hi ha **3 tipus de cartes**:
>
> **1) Cartes d'Entitat (Els "Monstres")**: Són els models d'IA.
> - *Exemple:* **Gemini 1.5 Pro** *(Atac: 2500, Defensa: 2000).* Poder passiu: **Visió Multimodal** *(Pot veure una carta cap per avall de l'oponent).*
> - *Exemple:* **Ollama Local** *(Atac: 1500, Defensa: 2800).* Poder passiu: **Escut de Privacitat** *(No pot ser afectat per cartes d'automatització rivals).*
>
> **2) Cartes d'Execució (Les "Màgiques/Trampes")**: Eines No-Code i plataformes.
> - *Exemple:* **Webhook de Make.** Efecte: *Automatitza el teu atac. La teva Entitat pot atacar dues vegades aquest torn.*
> - *Exemple:* **Bucle Infinit en n8n.** Efecte *(Trampa)*: *Quan el rival ataca, el seu atac es queda atrapat en un bucle i perd el torn.*
>
> **3) Cartes d'Entorn (Les de "Camp")**: Infraestructura.
> - *Exemple:* **Vercel Edge Network.** Efecte: *Augmenta la velocitat de resposta. Totes les Entitats amb atribut "Frontend" guanyen +500 d'Atac.*
>
> ## 💻 Stack Tecnològic *(Secció pel README)*
> - **Frontend:** Next.js *(App Router)*, React, Tailwind CSS *(per a disseny ràpid i net).*
> - **Llenguatge:** TypeScript *(crucial per definir la interfície estricta de cada carta i evitar errors durant la partida).*
> - **Animacions:** Framer Motion *(per als efectes de posar cartes al tauler, rebre dany, etc.).*
> - **Backend & Base de Dades:** Supabase *(PostgreSQL per a dades de cartes, Auth per a usuaris, i Row Level Security per protegir l'accés).*
> - **Intel·ligència Artificial (El Nucli del TFM):** API de Gemini *(via Google AI Studio).* S'utilitzarà per a:
>   - **El Cervell de l'Oponent:** A cada torn, s'envia l'estat del tauler a la IA en format JSON perquè decideixi la millor jugada i generi un diàleg burleta contra tu.
>   - **Generador de Cartes (Opcional):** Els usuaris poden descriure una eina de programari inventada i la IA genera les seves estadístiques equilibrades per al joc.
> - **Desplegament:** Vercel.
>
