import type { FrameworkImplementation, RowData } from '@benchmark/core';
import { generateRowData } from '@benchmark/utils';

export class VanillaImplementation implements FrameworkImplementation {
  name = 'Vanilla JS';
  version = '1.0.0';
  private container: HTMLElement;
  private tableBody!: HTMLElement;
  private currentData: RowData[] = [];
  private selectedRowId: string | null = null;

  constructor(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) {
      throw new Error(`Container element with id "${containerId}" not found`);
    }
    this.container = container;
    this.setupDOM();
  }

  private setupDOM() {
    this.container.innerHTML = `
      <div class="benchmark-container">
        <h2>Vanilla JS Implementation</h2>
        <table class="benchmark-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Label</th>
              <th>Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    `;

    this.tableBody = this.container.querySelector('tbody')!;
    this.addStyles();
  }

  private addStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .benchmark-container {
        padding: 20px;
        font-family: Arial, sans-serif;
      }
      .benchmark-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10px;
      }
      .benchmark-table th,
      .benchmark-table td {
        padding: 8px 12px;
        text-align: left;
        border-bottom: 1px solid #ddd;
      }
      .benchmark-table th {
        background-color: #f5f5f5;
        font-weight: bold;
      }
      .benchmark-table tr:hover {
        background-color: #f9f9f9;
      }
      .benchmark-table tr.selected {
        background-color: #e3f2fd !important;
      }
      .remove-btn {
        background: #ff4444;
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
      }
      .remove-btn:hover {
        background: #cc0000;
      }
    `;
    document.head.appendChild(style);
  }

  private createRowElement(data: RowData): HTMLTableRowElement {
    const row = document.createElement('tr');
    row.id = data.id;
    row.onclick = () => this.selectRow(data.id);
    
    row.innerHTML = `
      <td>${data.id}</td>
      <td>${data.label}</td>
      <td>${data.value}</td>
      <td><button class="remove-btn" onclick="event.stopPropagation()">Remove</button></td>
    `;

    const removeBtn = row.querySelector('.remove-btn') as HTMLButtonElement;
    removeBtn.onclick = (e) => {
      e.stopPropagation();
      this.removeRow(data.id);
    };

    return row;
  }

  async createRows(count: number): Promise<void> {
    const data = generateRowData(count);
    this.currentData = data;
    
    // Clear existing rows
    this.tableBody.innerHTML = '';
    
    // Create document fragment for efficient DOM manipulation
    const fragment = document.createDocumentFragment();
    
    data.forEach(rowData => {
      const row = this.createRowElement(rowData);
      fragment.appendChild(row);
    });

    this.tableBody.appendChild(fragment);
  }

  async replaceAll(newData: RowData[]): Promise<void> {
    this.currentData = newData;
    this.tableBody.innerHTML = '';
    
    const fragment = document.createDocumentFragment();
    
    newData.forEach(rowData => {
      const row = this.createRowElement(rowData);
      fragment.appendChild(row);
    });

    this.tableBody.appendChild(fragment);
  }

  async partialUpdate(data: RowData[]): Promise<void> {
    this.currentData = data;
    
    data.forEach(rowData => {
      const existingRow = document.getElementById(rowData.id);
      if (existingRow) {
        const cells = (existingRow as HTMLTableRowElement).cells;
        cells[1].textContent = rowData.label;
        cells[2].textContent = rowData.value.toString();
      }
    });
  }

  async selectRow(id: string): Promise<void> {
    // Remove previous selection
    if (this.selectedRowId) {
      const prevRow = document.getElementById(this.selectedRowId);
      if (prevRow) {
        prevRow.classList.remove('selected');
      }
    }

    // Add new selection
    const row = document.getElementById(id);
    if (row) {
      row.classList.add('selected');
      this.selectedRowId = id;
    }
  }

  async swapRows(id1: string, id2: string): Promise<void> {
    const row1 = document.getElementById(id1);
    const row2 = document.getElementById(id2);
    
    if (row1 && row2) {
      const temp = document.createElement('tr');
      row1.parentNode!.insertBefore(temp, row1);
      row2.parentNode!.insertBefore(row1, row2);
      temp.parentNode!.insertBefore(row2, temp);
      temp.remove();
    }
  }

  async removeRow(id: string): Promise<void> {
    const row = document.getElementById(id);
    if (row) {
      row.remove();
      this.currentData = this.currentData.filter(item => item.id !== id);
      
      if (this.selectedRowId === id) {
        this.selectedRowId = null;
      }
    }
  }

  async appendRows(data: RowData[]): Promise<void> {
    this.currentData.push(...data);
    
    const fragment = document.createDocumentFragment();
    
    data.forEach(rowData => {
      const row = this.createRowElement(rowData);
      fragment.appendChild(row);
    });

    this.tableBody.appendChild(fragment);
  }

  async clearRows(): Promise<void> {
    this.tableBody.innerHTML = '';
    this.currentData = [];
    this.selectedRowId = null;
  }

  cleanup(): void {
    this.clearRows();
    this.container.innerHTML = '';
  }
}