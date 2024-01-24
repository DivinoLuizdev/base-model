import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioChart1Component } from './relatorio.chart1.component';

describe('RelatorioChart1ComponentComponent', () => {
  let component: RelatorioChart1Component;
  let fixture: ComponentFixture<RelatorioChart1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RelatorioChart1Component]
    });
    fixture = TestBed.createComponent(RelatorioChart1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
