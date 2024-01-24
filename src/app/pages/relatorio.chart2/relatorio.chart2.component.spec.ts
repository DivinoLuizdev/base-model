import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioChart2Component } from './relatorio.chart2.component';

describe('RelatorioChart2ComponentComponent', () => {
  let component: RelatorioChart2Component;
  let fixture: ComponentFixture<RelatorioChart2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioChart2Component]
    });
    fixture = TestBed.createComponent(RelatorioChart2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
