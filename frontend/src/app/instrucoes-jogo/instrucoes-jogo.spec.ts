import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrucoesJogo } from './instrucoes-jogo';

describe('InstrucoesJogo', () => {
  let component: InstrucoesJogo;
  let fixture: ComponentFixture<InstrucoesJogo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstrucoesJogo],
    }).compileComponents();

    fixture = TestBed.createComponent(InstrucoesJogo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
