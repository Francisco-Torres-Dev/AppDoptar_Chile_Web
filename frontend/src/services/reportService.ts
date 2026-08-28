import type { Report, ReportStatus, ReportType, ReportUrgency } from '../types';
import { apiClient, delay, USE_MOCK } from './apiClient';
import { generateId, getMockStore, saveMockStore } from './mock/mockStore';
import { notificationService } from './notificationService';

export interface ReportFilters {
  type?: ReportType;
  urgency?: ReportUrgency;
  status?: ReportStatus;
  region?: string;
}

export const reportService = {
  async getAll(filters: ReportFilters = {}): Promise<Report[]> {
    if (USE_MOCK) {
      await delay(200);
      let reports = [...getMockStore().reports];
      if (filters.type) reports = reports.filter((r) => r.type === filters.type);
      if (filters.urgency) reports = reports.filter((r) => r.urgency === filters.urgency);
      if (filters.status) reports = reports.filter((r) => r.status === filters.status);
      if (filters.region) reports = reports.filter((r) => r.region === filters.region);
      return reports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    const { data } = await apiClient.get<Report[]>('/reports', { params: filters });
    return data;
  },

  async getById(id: string): Promise<Report | null> {
    if (USE_MOCK) {
      await delay(100);
      return getMockStore().reports.find((r) => r.id === id) || null;
    }
    const { data } = await apiClient.get<Report>(`/reports/${id}`);
    return data;
  },

  async create(report: Omit<Report, 'id' | 'createdAt' | 'helpersCount' | 'helperIds' | 'status'>): Promise<Report> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const newReport: Report = {
        ...report,
        id: generateId('report'),
        status: 'reportado',
        helpersCount: 0,
        helperIds: [],
        createdAt: new Date().toISOString(),
      };
      store.reports.push(newReport);
      saveMockStore(store);
      return newReport;
    }
    const { data } = await apiClient.post<Report>('/reports', report);
    return data;
  },

  async updateStatus(id: string, status: ReportStatus): Promise<Report> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const idx = store.reports.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error('Reporte no encontrado');
      store.reports[idx].status = status;
      const report = store.reports[idx];
      if (status === 'resuelto') {
        await notificationService.create({
          userId: report.reporterId,
          type: 'report_resolved',
          title: 'Reporte resuelto',
          message: 'Tu reporte fue marcado como resuelto.',
          link: '/mapa',
        });
      }
      saveMockStore(store);
      return report;
    }
    const { data } = await apiClient.patch<Report>(`/reports/${id}`, { status });
    return data;
  },

  async helpReport(reportId: string, userId: string): Promise<Report> {
    if (USE_MOCK) {
      await delay();
      const store = getMockStore();
      const report = store.reports.find((r) => r.id === reportId);
      if (!report) throw new Error('Reporte no encontrado');
      if (!report.helperIds.includes(userId)) {
        report.helperIds.push(userId);
        report.helpersCount = report.helperIds.length;
      }
      saveMockStore(store);
      return report;
    }
    const { data } = await apiClient.post<Report>(`/reports/${reportId}/help`);
    return data;
  },
};
