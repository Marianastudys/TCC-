import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SomService {

  // Liga/desliga todos os sons (útil para um botão "Sons" no futuro)
  somAtivado = true;

  private contexto: AudioContext | null = null;
  private usuarios = 0;

  // Evita tocar o som de foco várias vezes seguidas muito rápido
  private ultimoFoco = 0;

  // Som do Enter / clique (mesma pasta usada na página de jogo)
  private somConfirmar = new Audio('sounds/select.mp3');

  // =========================
  // ATIVAÇÃO (chamar nos componentes)
  // =========================

  // Chame no ngOnInit da página
  ativar() {
    this.usuarios++;

    if (this.usuarios === 1) {
      document.addEventListener('focusin', this.aoFocar);
      document.addEventListener('keydown', this.aoApertarTecla, true);
      document.addEventListener('click', this.aoClicar, true);
    }
  }

  // Chame no ngOnDestroy da página
  desativar() {
    this.usuarios = Math.max(0, this.usuarios - 1);

    if (this.usuarios === 0) {
      document.removeEventListener('focusin', this.aoFocar);
      document.removeEventListener('keydown', this.aoApertarTecla, true);
      document.removeEventListener('click', this.aoClicar, true);
    }
  }

  // =========================
  // EVENTOS
  // =========================

  // Som de seleção: quando um botão recebe o foco (seta, Tab ou mouse)
  private aoFocar = (evento: FocusEvent) => {
    const alvo = evento.target as HTMLElement | null;

    if (alvo?.closest('button')) {
      this.tocarSelecao();
    }
  };

  // Som de confirmação (teclado): Enter ou Espaço num botão ou no card das instruções
  private aoApertarTecla = (evento: KeyboardEvent) => {
    if (evento.repeat) return;
    if (evento.key !== 'Enter' && evento.key !== ' ') return;

    const ativo = document.activeElement as HTMLElement | null;

    if (ativo?.closest('button, [role="dialog"]')) {
      this.tocarConfirmar();
    }
  };

  // Som de confirmação (mouse): clique de verdade.
  // Cliques gerados pelo teclado têm detail = 0 e já tocaram acima.
  private aoClicar = (evento: MouseEvent) => {
    if (evento.detail === 0) return;

    const alvo = evento.target as HTMLElement | null;

    if (alvo?.closest('button')) {
      this.tocarConfirmar();
    }
  };

  // =========================
  // SONS
  // =========================

  // Seleção: dois bipes rápidos, estilo videogame
  private tocarSelecao() {
    const agora = performance.now();
    if (agora - this.ultimoFoco < 60) return;
    this.ultimoFoco = agora;

    this.tocarNota(988, 0, 0.05, 0.07, 'square');
    this.tocarNota(1319, 0.05, 0.07, 0.07, 'square');
  }

  // Confirmação: toca o arquivo; se ele não existir ou falhar,
  // usa duas notas subindo geradas por código
  private tocarConfirmar() {
    if (!this.somAtivado) return;

    this.somConfirmar.currentTime = 0;
    this.somConfirmar.play().catch(() => {
      this.tocarNota(523, 0, 0.11, 0.18);
      this.tocarNota(784, 0.09, 0.16, 0.18);
    });
  }

  private tocarNota(
    frequencia: number,
    atraso: number,
    duracao: number,
    volume: number,
    tipo: OscillatorType = 'sine'
  ) {
    if (!this.somAtivado) return;

    const ctx = this.obterContexto();
    if (!ctx) return;

    const inicio = ctx.currentTime + atraso;

    const oscilador = ctx.createOscillator();
    const ganho = ctx.createGain();

    oscilador.type = tipo;
    oscilador.frequency.value = frequencia;

    // Sobe e desce o volume rápido para não "estalar"
    ganho.gain.setValueAtTime(0.0001, inicio);
    ganho.gain.exponentialRampToValueAtTime(volume, inicio + 0.01);
    ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + duracao);

    oscilador.connect(ganho);
    ganho.connect(ctx.destination);

    oscilador.start(inicio);
    oscilador.stop(inicio + duracao + 0.02);
  }

  private obterContexto(): AudioContext | null {
    if (!this.contexto) {
      const classe = window.AudioContext || (window as any).webkitAudioContext;
      if (!classe) return null;
      this.contexto = new classe();
    }

    // Navegadores deixam o áudio "suspenso" até a primeira interação
    if (this.contexto.state === 'suspended') {
      this.contexto.resume();
    }

    return this.contexto;
  }
}