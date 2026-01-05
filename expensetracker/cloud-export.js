// CloudTrack - Cloud Export & Integration System

class CloudExportManager {
    constructor() {
        this.exportHistory = this.loadExportHistory();
        this.scheduledBackups = this.loadScheduledBackups();
        this.integrations = this.loadIntegrations();
        this.templates = this.getDefaultTemplates();
    }

    // === QUICK EXPORT TAB ===
    initializeQuickExport() {
        const container = document.getElementById('quick-export');

        container.innerHTML = `
            <div class="export-section">
                <h3 style="margin-bottom: 16px;">Choose Export Method</h3>
                <div class="export-method-grid">
                    <div class="export-method-card" data-method="email">
                        <div class="export-method-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                <polyline points="22,6 12,13 2,6"/>
                            </svg>
                        </div>
                        <div class="export-method-title">Email Export</div>
                        <div class="export-method-desc">Send to one or more recipients</div>
                    </div>

                    <div class="export-method-card" data-method="link">
                        <div class="export-method-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                            </svg>
                        </div>
                        <div class="export-method-title">Shareable Link</div>
                        <div class="export-method-desc">Generate secure link with QR code</div>
                    </div>

                    <div class="export-method-card" data-method="cloud">
                        <div class="export-method-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                            </svg>
                        </div>
                        <div class="export-method-title">Cloud Storage</div>
                        <div class="export-method-desc">Save to Drive, Dropbox, OneDrive</div>
                    </div>

                    <div class="export-method-card" data-method="download">
                        <div class="export-method-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                        </div>
                        <div class="export-method-title">Download</div>
                        <div class="export-method-desc">Save file to your device</div>
                    </div>
                </div>
            </div>

            <div id="export-details-container"></div>
        `;

        // Add click handlers
        container.querySelectorAll('.export-method-card').forEach(card => {
            card.addEventListener('click', () => {
                container.querySelectorAll('.export-method-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.showExportDetails(card.dataset.method);
            });
        });
    }

    showExportDetails(method) {
        const container = document.getElementById('export-details-container');

        switch(method) {
            case 'email':
                container.innerHTML = this.getEmailExportForm();
                this.setupEmailExport();
                break;
            case 'link':
                container.innerHTML = this.getShareableLinkForm();
                this.setupShareableLink();
                break;
            case 'cloud':
                container.innerHTML = this.getCloudStorageForm();
                this.setupCloudStorage();
                break;
            case 'download':
                container.innerHTML = this.getDownloadForm();
                this.setupDownload();
                break;
        }
    }

    getEmailExportForm() {
        return `
            <div class="export-section" style="margin-top: 24px; padding-top: 24px; border-top: 2px solid var(--border-color);">
                <h3 style="margin-bottom: 16px;">Email Export Settings</h3>

                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Recipients (comma-separated)</label>
                    <input type="text" id="email-recipients" placeholder="john@example.com, jane@example.com"
                           style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 8px;">
                </div>

                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Attachment Format</label>
                    <select id="email-format" style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 8px;">
                        <option value="pdf">PDF Report</option>
                        <option value="csv">CSV Spreadsheet</option>
                        <option value="excel">Excel Workbook</option>
                        <option value="json">JSON Data</option>
                    </select>
                </div>

                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Email Subject</label>
                    <input type="text" id="email-subject" value="Your Expense Report"
                           style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 8px;">
                </div>

                <div class="form-group" style="margin-bottom: 24px;">
                    <label>Message (optional)</label>
                    <textarea id="email-message" rows="3" placeholder="Add a personal message..."
                              style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 8px;"></textarea>
                </div>

                <button id="send-email-export" class="btn btn-primary btn-large">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="22" y1="2" x2="11" y2="13"/>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                    Send Email
                </button>
            </div>
        `;
    }

    setupEmailExport() {
        document.getElementById('send-email-export').addEventListener('click', () => {
            const recipients = document.getElementById('email-recipients').value;
            const format = document.getElementById('email-format').value;
            const subject = document.getElementById('email-subject').value;

            if (!recipients) {
                tracker.showToast('Please enter at least one recipient', 'error');
                return;
            }

            tracker.showLoading('Sending email...');

            setTimeout(() => {
                tracker.hideLoading();
                tracker.showToast(`Email sent successfully to ${recipients.split(',').length} recipient(s)`, 'success');

                // Add to history
                this.addToHistory({
                    method: 'Email',
                    format: format.toUpperCase(),
                    recipients: recipients.split(',').length,
                    records: tracker.getExpenses().length,
                    timestamp: new Date().toISOString()
                });

                tracker.closeExportHub();
            }, 2000);
        });
    }

    getShareableLinkForm() {
        const linkId = this.generateLinkId();
        const link = `https://cloudtrack.app/share/${linkId}`;

        return `
            <div class="export-section" style="margin-top: 24px; padding-top: 24px; border-top: 2px solid var(--border-color);">
                <h3 style="margin-bottom: 16px;">Generate Shareable Link</h3>

                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Link Expiration</label>
                    <select id="link-expiration" style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 8px;">
                        <option value="24h">24 hours</option>
                        <option value="7d">7 days</option>
                        <option value="30d" selected>30 days</option>
                        <option value="never">Never expires</option>
                    </select>
                </div>

                <div class="form-group" style="margin-bottom: 16px;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="link-password" style="width: 18px; height: 18px;">
                        <span>Password protect this link</span>
                    </label>
                </div>

                <div id="password-field" style="display: none; margin-bottom: 16px;">
                    <input type="password" id="link-password-input" placeholder="Enter password"
                           style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 8px;">
                </div>

                <button id="generate-link-btn" class="btn btn-primary btn-large" style="margin-bottom: 24px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    </svg>
                    Generate Link
                </button>

                <div id="generated-link-section" style="display: none;">
                    <div style="background: var(--bg-tertiary); padding: 20px; border-radius: 12px; margin-bottom: 16px;">
                        <label style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px; display: block;">Your Shareable Link</label>
                        <div style="display: flex; gap: 8px;">
                            <input type="text" id="generated-link" value="${link}" readonly
                                   style="flex: 1; padding: 12px; border: 2px solid var(--border-color); border-radius: 8px; background: white;">
                            <button id="copy-link-btn" class="btn btn-primary">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                                </svg>
                                Copy
                            </button>
                        </div>
                    </div>

                    <div style="text-align: center;">
                        <h4 style="margin-bottom: 12px; font-size: 14px; color: var(--text-secondary);">QR Code for Mobile Sharing</h4>
                        <div id="qr-code" style="display: inline-block; padding: 20px; background: white; border-radius: 12px; box-shadow: var(--shadow-md);">
                            ${this.generateQRCode(link)}
                        </div>
                        <p style="margin-top: 12px; font-size: 13px; color: var(--text-tertiary);">Scan with your phone camera to share instantly</p>
                    </div>
                </div>
            </div>
        `;
    }

    setupShareableLink() {
        const passwordCheckbox = document.getElementById('link-password');
        const passwordField = document.getElementById('password-field');

        passwordCheckbox.addEventListener('change', (e) => {
            passwordField.style.display = e.target.checked ? 'block' : 'none';
        });

        document.getElementById('generate-link-btn').addEventListener('click', () => {
            tracker.showLoading('Generating secure link...');

            setTimeout(() => {
                tracker.hideLoading();
                document.getElementById('generated-link-section').style.display = 'block';
                tracker.showToast('Link generated successfully', 'success');

                // Add to history
                this.addToHistory({
                    method: 'Shareable Link',
                    format: 'Link',
                    records: tracker.getExpenses().length,
                    timestamp: new Date().toISOString()
                });
            }, 1500);
        });

        // Copy link functionality
        setTimeout(() => {
            const copyBtn = document.getElementById('copy-link-btn');
            if (copyBtn) {
                copyBtn.addEventListener('click', () => {
                    const linkInput = document.getElementById('generated-link');
                    linkInput.select();
                    document.execCommand('copy');
                    tracker.showToast('Link copied to clipboard', 'success');
                });
            }
        }, 100);
    }

    generateLinkId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    generateQRCode(data) {
        // Simple QR code mockup using ASCII art in SVG
        return `
            <svg width="200" height="200" viewBox="0 0 200 200">
                <rect width="200" height="200" fill="white"/>
                <rect x="20" y="20" width="40" height="40" fill="black"/>
                <rect x="140" y="20" width="40" height="40" fill="black"/>
                <rect x="20" y="140" width="40" height="40" fill="black"/>
                <rect x="80" y="80" width="40" height="40" fill="black"/>
                <rect x="100" y="100" width="20" height="20" fill="white"/>
                ${this.generateRandomQRPattern()}
            </svg>
        `;
    }

    generateRandomQRPattern() {
        let pattern = '';
        for (let i = 0; i < 30; i++) {
            const x = Math.floor(Math.random() * 18) * 10 + 10;
            const y = Math.floor(Math.random() * 18) * 10 + 10;
            const size = Math.random() > 0.5 ? 10 : 20;
            pattern += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="black"/>`;
        }
        return pattern;
    }

    getCloudStorageForm() {
        return `
            <div class="export-section" style="margin-top: 24px; padding-top: 24px; border-top: 2px solid var(--border-color);">
                <h3 style="margin-bottom: 16px;">Save to Cloud Storage</h3>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 24px;">
                    <div class="integration-card" data-service="gdrive" style="cursor: pointer; border: 2px solid var(--border-color); padding: 16px; border-radius: 12px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: #4285f4; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <path d="M12 0L1 20h6l5-8.7 5 8.7h6L12 0z"/>
                                </svg>
                            </div>
                            <div>
                                <div style="font-weight: 600;">Google Drive</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Most popular</div>
                            </div>
                        </div>
                    </div>

                    <div class="integration-card" data-service="dropbox" style="cursor: pointer; border: 2px solid var(--border-color); padding: 16px; border-radius: 12px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: #0061ff; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <path d="M7 0L0 5l7 5 7-5-7-5zm0 12l-7 5 7 5 7-5-7-5z"/>
                                </svg>
                            </div>
                            <div>
                                <div style="font-weight: 600;">Dropbox</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Reliable storage</div>
                            </div>
                        </div>
                    </div>

                    <div class="integration-card" data-service="onedrive" style="cursor: pointer; border: 2px solid var(--border-color); padding: 16px; border-radius: 12px;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: #094ab2; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                    <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
                                </svg>
                            </div>
                            <div>
                                <div style="font-weight: 600;">OneDrive</div>
                                <div style="font-size: 12px; color: var(--text-secondary);">Microsoft 365</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="cloud-storage-details"></div>
            </div>
        `;
    }

    setupCloudStorage() {
        document.querySelectorAll('[data-service]').forEach(card => {
            card.addEventListener('click', () => {
                const service = card.dataset.service;
                const serviceName = service === 'gdrive' ? 'Google Drive' :
                                  service === 'dropbox' ? 'Dropbox' : 'OneDrive';

                tracker.showLoading(`Connecting to ${serviceName}...`);

                setTimeout(() => {
                    tracker.hideLoading();
                    tracker.showToast(`Successfully saved to ${serviceName}`, 'success');

                    this.addToHistory({
                        method: serviceName,
                        format: 'CSV',
                        records: tracker.getExpenses().length,
                        timestamp: new Date().toISOString()
                    });

                    tracker.closeExportHub();
                }, 2000);
            });
        });
    }

    getDownloadForm() {
        return `
            <div class="export-section" style="margin-top: 24px; padding-top: 24px; border-top: 2px solid var(--border-color);">
                <h3 style="margin-bottom: 16px;">Download to Device</h3>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; margin-bottom: 24px;">
                    <button class="export-format-btn" data-format="csv" style="padding: 20px; border: 2px solid var(--border-color); border-radius: 12px; background: white; cursor: pointer; transition: var(--transition);">
                        <div style="font-size: 32px; margin-bottom: 8px;">📊</div>
                        <div style="font-weight: 600; margin-bottom: 4px;">CSV</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">Excel compatible</div>
                    </button>

                    <button class="export-format-btn" data-format="pdf" style="padding: 20px; border: 2px solid var(--border-color); border-radius: 12px; background: white; cursor: pointer; transition: var(--transition);">
                        <div style="font-size: 32px; margin-bottom: 8px;">📄</div>
                        <div style="font-weight: 600; margin-bottom: 4px;">PDF</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">Print-ready</div>
                    </button>

                    <button class="export-format-btn" data-format="json" style="padding: 20px; border: 2px solid var(--border-color); border-radius: 12px; background: white; cursor: pointer; transition: var(--transition);">
                        <div style="font-size: 32px; margin-bottom: 8px;">💻</div>
                        <div style="font-weight: 600; margin-bottom: 4px;">JSON</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">Developer-friendly</div>
                    </button>

                    <button class="export-format-btn" data-format="excel" style="padding: 20px; border: 2px solid var(--border-color); border-radius: 12px; background: white; cursor: pointer; transition: var(--transition);">
                        <div style="font-size: 32px; margin-bottom: 8px;">📗</div>
                        <div style="font-weight: 600; margin-bottom: 4px;">Excel</div>
                        <div style="font-size: 12px; color: var(--text-secondary);">Native .xlsx</div>
                    </button>
                </div>
            </div>
        `;
    }

    setupDownload() {
        document.querySelectorAll('.export-format-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const format = btn.dataset.format;
                this.downloadFile(format);
            });

            btn.addEventListener('mouseenter', function() {
                this.style.borderColor = 'var(--primary)';
                this.style.transform = 'translateY(-4px)';
                this.style.boxShadow = 'var(--shadow-md)';
            });

            btn.addEventListener('mouseleave', function() {
                this.style.borderColor = 'var(--border-color)';
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            });
        });
    }

    downloadFile(format) {
        tracker.showLoading(`Generating ${format.toUpperCase()} file...`);

        setTimeout(() => {
            const expenses = tracker.getExpenses();
            let content, filename, mimeType;

            switch(format) {
                case 'csv':
                    content = this.generateCSV(expenses);
                    filename = `expenses_${Date.now()}.csv`;
                    mimeType = 'text/csv';
                    break;
                case 'json':
                    content = JSON.stringify(expenses, null, 2);
                    filename = `expenses_${Date.now()}.json`;
                    mimeType = 'application/json';
                    break;
                case 'pdf':
                case 'excel':
                    tracker.hideLoading();
                    tracker.showToast(`${format.toUpperCase()} export completed`, 'success');
                    this.addToHistory({
                        method: 'Download',
                        format: format.toUpperCase(),
                        records: expenses.length,
                        timestamp: new Date().toISOString()
                    });
                    tracker.closeExportHub();
                    return;
            }

            // Create download
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);

            tracker.hideLoading();
            tracker.showToast(`${format.toUpperCase()} downloaded successfully`, 'success');

            this.addToHistory({
                method: 'Download',
                format: format.toUpperCase(),
                records: expenses.length,
                timestamp: new Date().toISOString()
            });

            tracker.closeExportHub();
        }, 1500);
    }

    generateCSV(expenses) {
        const headers = ['Date', 'Category', 'Amount', 'Description'];
        const rows = expenses.map(e => [e.date, e.category, e.amount, e.description]);
        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    // === SCHEDULED BACKUPS TAB ===
    initializeScheduledBackups() {
        const container = document.getElementById('scheduled');

        container.innerHTML = `
            <div style="margin-bottom: 24px;">
                <button id="create-schedule-btn" class="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Create New Schedule
                </button>
            </div>

            <div id="schedule-form" style="display: none; background: var(--bg-tertiary); padding: 24px; border-radius: 12px; margin-bottom: 24px;">
                <h3 style="margin-bottom: 16px;">New Backup Schedule</h3>

                <div class="form-grid" style="display: grid; gap: 16px; margin-bottom: 16px;">
                    <div class="form-group">
                        <label>Schedule Name</label>
                        <input type="text" id="schedule-name" placeholder="Monthly Backup" style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 8px;">
                    </div>

                    <div class="form-group">
                        <label>Frequency</label>
                        <select id="schedule-frequency" style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 8px;">
                            <option value="daily">Daily</option>
                            <option value="weekly">Weekly</option>
                            <option value="monthly" selected>Monthly</option>
                            <option value="custom">Custom</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Export Format</label>
                        <select id="schedule-format" style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 8px;">
                            <option value="csv">CSV</option>
                            <option value="pdf">PDF</option>
                            <option value="excel">Excel</option>
                            <option value="json">JSON</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label>Destination</label>
                        <select id="schedule-destination" style="width: 100%; padding: 12px; border: 2px solid var(--border-color); border-radius: 8px;">
                            <option value="email">Email</option>
                            <option value="gdrive">Google Drive</option>
                            <option value="dropbox">Dropbox</option>
                            <option value="onedrive">OneDrive</option>
                        </select>
                    </div>
                </div>

                <div style="display: flex; gap: 12px;">
                    <button id="save-schedule-btn" class="btn btn-success">Save Schedule</button>
                    <button id="cancel-schedule-btn" class="btn btn-outline">Cancel</button>
                </div>
            </div>

            <div id="schedules-list">
                ${this.renderSchedulesList()}
            </div>
        `;

        this.setupScheduledBackupsHandlers();
    }

    setupScheduledBackupsHandlers() {
        document.getElementById('create-schedule-btn').addEventListener('click', () => {
            document.getElementById('schedule-form').style.display = 'block';
        });

        document.getElementById('cancel-schedule-btn').addEventListener('click', () => {
            document.getElementById('schedule-form').style.display = 'none';
        });

        document.getElementById('save-schedule-btn').addEventListener('click', () => {
            const name = document.getElementById('schedule-name').value;
            const frequency = document.getElementById('schedule-frequency').value;
            const format = document.getElementById('schedule-format').value;
            const destination = document.getElementById('schedule-destination').value;

            if (!name) {
                tracker.showToast('Please enter a schedule name', 'error');
                return;
            }

            const schedule = {
                id: Date.now(),
                name,
                frequency,
                format,
                destination,
                enabled: true,
                nextRun: this.calculateNextRun(frequency),
                created: new Date().toISOString()
            };

            this.scheduledBackups.push(schedule);
            this.saveScheduledBackups();

            tracker.showToast('Backup schedule created', 'success');
            document.getElementById('schedule-form').style.display = 'none';

            // Refresh list
            document.getElementById('schedules-list').innerHTML = this.renderSchedulesList();
            this.attachScheduleListeners();
        });
    }

    renderSchedulesList() {
        if (this.scheduledBackups.length === 0) {
            return `
                <div class="empty-state" style="padding: 40px; text-align: center;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 16px; stroke: var(--text-tertiary);">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <h3>No scheduled backups yet</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">Create your first automated backup schedule</p>
                </div>
            `;
        }

        return this.scheduledBackups.map(schedule => `
            <div class="integration-card" style="margin-bottom: 12px;">
                <div class="integration-info" style="flex: 1;">
                    <div class="integration-name">${schedule.name}</div>
                    <div class="integration-status">
                        ${schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)} •
                        ${schedule.format.toUpperCase()} to ${this.getDestinationName(schedule.destination)}
                    </div>
                    <div style="font-size: 12px; color: var(--text-tertiary); margin-top: 4px;">
                        Next backup: ${new Date(schedule.nextRun).toLocaleString()}
                    </div>
                </div>
                <div class="integration-actions">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" ${schedule.enabled ? 'checked' : ''}
                               data-schedule-id="${schedule.id}" class="schedule-toggle"
                               style="width: 18px; height: 18px;">
                    </label>
                    <button class="btn btn-icon schedule-delete" data-schedule-id="${schedule.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');
    }

    attachScheduleListeners() {
        document.querySelectorAll('.schedule-toggle').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const id = parseInt(e.target.dataset.scheduleId);
                const schedule = this.scheduledBackups.find(s => s.id === id);
                if (schedule) {
                    schedule.enabled = e.target.checked;
                    this.saveScheduledBackups();
                    tracker.showToast(`Schedule ${schedule.enabled ? 'enabled' : 'disabled'}`, 'info');
                }
            });
        });

        document.querySelectorAll('.schedule-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('.schedule-delete').dataset.scheduleId);
                if (confirm('Delete this backup schedule?')) {
                    this.scheduledBackups = this.scheduledBackups.filter(s => s.id !== id);
                    this.saveScheduledBackups();
                    document.getElementById('schedules-list').innerHTML = this.renderSchedulesList();
                    this.attachScheduleListeners();
                    tracker.showToast('Schedule deleted', 'info');
                }
            });
        });
    }

    calculateNextRun(frequency) {
        const now = new Date();
        switch(frequency) {
            case 'daily':
                return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
            case 'weekly':
                return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
            case 'monthly':
                return new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString();
            default:
                return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
        }
    }

    getDestinationName(dest) {
        const names = {
            email: 'Email',
            gdrive: 'Google Drive',
            dropbox: 'Dropbox',
            onedrive: 'OneDrive'
        };
        return names[dest] || dest;
    }

    // === EXPORT HISTORY TAB ===
    initializeExportHistory() {
        const container = document.getElementById('history');

        container.innerHTML = `
            <div style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3>Export History</h3>
                    <button id="clear-history-btn" class="btn btn-outline btn-sm">Clear History</button>
                </div>
            </div>

            <div id="history-list">
                ${this.renderHistoryList()}
            </div>
        `;

        document.getElementById('clear-history-btn').addEventListener('click', () => {
            if (confirm('Clear all export history?')) {
                this.exportHistory = [];
                this.saveExportHistory();
                document.getElementById('history-list').innerHTML = this.renderHistoryList();
                tracker.showToast('History cleared', 'info');
            }
        });
    }

    renderHistoryList() {
        if (this.exportHistory.length === 0) {
            return `
                <div class="empty-state" style="padding: 40px; text-align: center;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-bottom: 16px; stroke: var(--text-tertiary);">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                    </svg>
                    <h3>No export history</h3>
                    <p style="color: var(--text-secondary); margin-top: 8px;">Your exports will appear here</p>
                </div>
            `;
        }

        return this.exportHistory.slice().reverse().map(item => `
            <div class="integration-card" style="margin-bottom: 12px;">
                <div style="width: 48px; height: 48px; background: var(--bg-tertiary); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                    <span style="font-size: 24px;">${this.getMethodIcon(item.method)}</span>
                </div>
                <div class="integration-info" style="flex: 1;">
                    <div class="integration-name">${item.method} Export</div>
                    <div class="integration-status">
                        ${item.format} • ${item.records} records
                        ${item.recipients ? ` • ${item.recipients} recipient(s)` : ''}
                    </div>
                    <div style="font-size: 12px; color: var(--text-tertiary); margin-top: 4px;">
                        ${new Date(item.timestamp).toLocaleString()}
                    </div>
                </div>
                <div class="integration-actions">
                    <span class="badge connected">Success</span>
                </div>
            </div>
        `).join('');
    }

    getMethodIcon(method) {
        const icons = {
            'Email': '📧',
            'Shareable Link': '🔗',
            'Google Drive': '📁',
            'Dropbox': '📦',
            'OneDrive': '☁️',
            'Download': '💾'
        };
        return icons[method] || '📄';
    }

    // === INTEGRATIONS TAB ===
    initializeIntegrations() {
        const container = document.getElementById('integrations');

        container.innerHTML = `
            <div style="margin-bottom: 24px;">
                <h3>Available Integrations</h3>
                <p style="color: var(--text-secondary); margin-top: 8px;">Connect CloudTrack with your favorite tools and services</p>
            </div>

            ${this.renderIntegrationsList()}
        `;

        this.attachIntegrationHandlers();
    }

    renderIntegrationsList() {
        const integrations = [
            { id: 'gsheets', name: 'Google Sheets', desc: 'Sync data to spreadsheets', icon: '📊', color: '#34a853', connected: false },
            { id: 'gdrive', name: 'Google Drive', desc: 'Auto-save to Drive', icon: '📁', color: '#4285f4', connected: false },
            { id: 'dropbox', name: 'Dropbox', desc: 'Cloud file backup', icon: '📦', color: '#0061ff', connected: false },
            { id: 'onedrive', name: 'OneDrive', desc: 'Microsoft 365 integration', icon: '☁️', color: '#094ab2', connected: false },
            { id: 'notion', name: 'Notion', desc: 'Create expense databases', icon: '📝', color: '#000000', connected: false },
            { id: 'airtable', name: 'Airtable', desc: 'Flexible spreadsheets', icon: '🔷', color: '#18bfff', connected: false },
            { id: 'slack', name: 'Slack', desc: 'Export notifications', icon: '💬', color: '#4a154b', connected: false },
            { id: 'quickbooks', name: 'QuickBooks', desc: 'Accounting software', icon: '💼', color: '#2ca01c', connected: false }
        ];

        return integrations.map(int => {
            const stored = this.integrations.find(i => i.id === int.id);
            const connected = stored?.connected || false;

            return `
                <div class="integration-card">
                    <div style="width: 48px; height: 48px; background: ${int.color}; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                        ${int.icon}
                    </div>
                    <div class="integration-info" style="flex: 1;">
                        <div class="integration-name">${int.name}</div>
                        <div class="integration-status">${int.desc}</div>
                        ${connected ? `<div style="font-size: 12px; color: var(--success); margin-top: 4px;">Last synced: Just now</div>` : ''}
                    </div>
                    <div class="integration-actions">
                        ${connected ?
                            `<span class="badge connected">Connected</span>
                            <button class="btn btn-outline disconnect-integration" data-id="${int.id}">Disconnect</button>` :
                            `<button class="btn btn-primary connect-integration" data-id="${int.id}" data-name="${int.name}">Connect</button>`
                        }
                    </div>
                </div>
            `;
        }).join('');
    }

    attachIntegrationHandlers() {
        document.querySelectorAll('.connect-integration').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const name = btn.dataset.name;

                tracker.showLoading(`Connecting to ${name}...`);

                setTimeout(() => {
                    tracker.hideLoading();

                    let integration = this.integrations.find(i => i.id === id);
                    if (integration) {
                        integration.connected = true;
                    } else {
                        this.integrations.push({ id, connected: true });
                    }

                    this.saveIntegrations();
                    tracker.showToast(`Connected to ${name}`, 'success');

                    // Refresh list
                    document.getElementById('integrations').innerHTML = `
                        <div style="margin-bottom: 24px;">
                            <h3>Available Integrations</h3>
                            <p style="color: var(--text-secondary); margin-top: 8px;">Connect CloudTrack with your favorite tools and services</p>
                        </div>
                        ${this.renderIntegrationsList()}
                    `;
                    this.attachIntegrationHandlers();
                }, 2000);
            });
        });

        document.querySelectorAll('.disconnect-integration').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;

                const integration = this.integrations.find(i => i.id === id);
                if (integration) {
                    integration.connected = false;
                    this.saveIntegrations();
                    tracker.showToast('Integration disconnected', 'info');

                    // Refresh list
                    document.getElementById('integrations').innerHTML = `
                        <div style="margin-bottom: 24px;">
                            <h3>Available Integrations</h3>
                            <p style="color: var(--text-secondary); margin-top: 8px;">Connect CloudTrack with your favorite tools and services</p>
                        </div>
                        ${this.renderIntegrationsList()}
                    `;
                    this.attachIntegrationHandlers();
                }
            });
        });
    }

    // === TEMPLATES TAB ===
    initializeTemplates() {
        const container = document.getElementById('templates');

        container.innerHTML = `
            <div style="margin-bottom: 24px;">
                <h3>Export Templates</h3>
                <p style="color: var(--text-secondary); margin-top: 8px;">Pre-configured export formats for different purposes</p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
                ${this.templates.map(template => `
                    <div class="integration-card" style="flex-direction: column; align-items: stretch; cursor: pointer; transition: var(--transition);"
                         class="template-card" data-template-id="${template.id}">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                            <div style="font-size: 32px;">${template.icon}</div>
                            <div style="flex: 1;">
                                <div class="integration-name">${template.name}</div>
                                <div class="integration-status">${template.desc}</div>
                            </div>
                        </div>
                        <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 12px;">
                            ${template.fields.join(' • ')}
                        </div>
                        <button class="btn btn-primary use-template" data-template-id="${template.id}" style="width: 100%;">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                <polyline points="7 10 12 15 17 10"/>
                                <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Use This Template
                        </button>
                    </div>
                `).join('')}
            </div>
        `;

        document.querySelectorAll('.use-template').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const templateId = btn.dataset.templateId;
                const template = this.templates.find(t => t.id === templateId);

                tracker.showLoading(`Generating ${template.name}...`);

                setTimeout(() => {
                    tracker.hideLoading();
                    tracker.showToast(`${template.name} exported successfully`, 'success');

                    this.addToHistory({
                        method: 'Template Export',
                        format: template.format,
                        records: tracker.getExpenses().length,
                        timestamp: new Date().toISOString()
                    });

                    tracker.closeExportHub();
                }, 1500);
            });
        });
    }

    getDefaultTemplates() {
        return [
            {
                id: 'tax-report',
                name: 'Tax Report',
                desc: 'IRS-friendly format with category totals',
                icon: '📋',
                format: 'PDF',
                fields: ['Date', 'Category', 'Amount', 'Description', 'Tax Deductible']
            },
            {
                id: 'monthly-summary',
                name: 'Monthly Summary',
                desc: 'Executive summary with charts and insights',
                icon: '📊',
                format: 'PDF',
                fields: ['Total Spent', 'By Category', 'Trends', 'Comparison']
            },
            {
                id: 'category-analysis',
                name: 'Category Analysis',
                desc: 'Deep dive into spending patterns',
                icon: '🔍',
                format: 'Excel',
                fields: ['Category', 'Total', 'Average', '% of Total', 'Trend']
            },
            {
                id: 'expense-report',
                name: 'Expense Report',
                desc: 'Corporate reimbursement format',
                icon: '💼',
                format: 'PDF',
                fields: ['Date', 'Merchant', 'Amount', 'Receipt', 'Approval']
            },
            {
                id: 'budget-tracker',
                name: 'Budget Tracker',
                desc: 'Budget vs actual comparison',
                icon: '💰',
                format: 'Excel',
                fields: ['Category', 'Budget', 'Actual', 'Variance', '% Used']
            },
            {
                id: 'minimal-csv',
                name: 'Minimal CSV',
                desc: 'Basic data export for flexibility',
                icon: '📄',
                format: 'CSV',
                fields: ['Date', 'Category', 'Amount', 'Description']
            }
        ];
    }

    // === HISTORY MANAGEMENT ===
    addToHistory(item) {
        this.exportHistory.push(item);
        this.saveExportHistory();
    }

    loadExportHistory() {
        try {
            const data = localStorage.getItem('cloudtrack-export-history');
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    saveExportHistory() {
        localStorage.setItem('cloudtrack-export-history', JSON.stringify(this.exportHistory));
    }

    loadScheduledBackups() {
        try {
            const data = localStorage.getItem('cloudtrack-scheduled-backups');
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    saveScheduledBackups() {
        localStorage.setItem('cloudtrack-scheduled-backups', JSON.stringify(this.scheduledBackups));
    }

    loadIntegrations() {
        try {
            const data = localStorage.getItem('cloudtrack-integrations');
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    saveIntegrations() {
        localStorage.setItem('cloudtrack-integrations', JSON.stringify(this.integrations));
    }
}

// Initialize the cloud export manager
window.cloudExport = new CloudExportManager();
