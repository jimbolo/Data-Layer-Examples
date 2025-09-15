/**
 * Secondary Google Ads Purchase Tracking System
 * Implements comprehensive failsafe tracking with event aggregation and scoring
 * Documentation: https://claude.ai/share/d56c75c8-ffb6-4507-b57a-87e9b075d743
 */

class SecondaryTrackingSystem {
    constructor(config = {}) {
        this.config = {
            purchaseEndpoints: ['/checkout', '/purchase', '/order-complete', '/thank-you', '/confirmation'],
            purchaseKeywords: ['order_id', 'transaction_id', 'purchase', 'payment_complete', 'checkout_success'],
            storageKeys: ['cart_data', 'purchase_data', 'checkout_complete', 'order_info'],
            confidenceThreshold: 0.7,
            maxRetries: 3,
            retryDelay: 1000,
            googleAdsConversionId: config.conversionId || '',
            googleAdsConversionLabel: config.conversionLabel || '',
            debug: config.debug || false,
            ...config
        };

        // Internal state
        this.trackingData = new Map();
        this.purchaseEvents = [];
        this.confidenceScores = new Map();
        this.originalMethods = {};
        this.eventQueue = [];
        this.processingQueue = false;

        // Initialize tracking systems
        this.initNetworkMonitoring();
        this.initHistoryTracking();
        this.initStorageMonitoring();
        this.initCustomEventTracking();
        this.setupFailsafes();
        this.startEventProcessor();

        this.log('SecondaryTrackingSystem initialized');
    }

    /**
     * Network Request Monitoring
     */
    initNetworkMonitoring() {
        // Intercept fetch requests
        this.originalMethods.fetch = window.fetch;
        window.fetch = (...args) => {
            const promise = this.originalMethods.fetch.apply(window, args);
            
            if (this.isPurchaseEndpoint(args[0])) {
                this.log('Purchase endpoint detected via fetch:', args[0]);
                promise.then(response => {
                    if (response.ok) {
                        this.processPurchaseResponse('network-fetch', response.clone(), args[0]);
                    }
                }).catch(error => {
                    this.log('Fetch error:', error);
                });
            }
            
            return promise;
        };

        // Intercept XMLHttpRequest
        this.originalMethods.xhrOpen = XMLHttpRequest.prototype.open;
        this.originalMethods.xhrSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._trackingUrl = url;
            return this.constructor.prototype.open.call(this, method, url, ...args);
        };

        XMLHttpRequest.prototype.send = function(...args) {
            if (this._trackingUrl && this.constructor.prototype.isPurchaseEndpoint?.call(this, this._trackingUrl)) {
                this.addEventListener('load', (e) => {
                    if (this.status >= 200 && this.status < 300) {
                        this.constructor.prototype.processPurchaseResponse?.call(
                            this, 
                            'network-xhr', 
                            { text: () => Promise.resolve(this.responseText) }, 
                            this._trackingUrl
                        );
                    }
                });
            }
            return this.constructor.prototype.send.call(this, ...args);
        };

        // Bind methods to XMLHttpRequest prototype for access
        XMLHttpRequest.prototype.isPurchaseEndpoint = this.isPurchaseEndpoint.bind(this);
        XMLHttpRequest.prototype.processPurchaseResponse = this.processPurchaseResponse.bind(this);
    }

    /**
     * History Change Monitoring
     */
    initHistoryTracking() {
        // Monitor pushState and replaceState
        this.originalMethods.pushState = history.pushState;
        this.originalMethods.replaceState = history.replaceState;

        history.pushState = (...args) => {
            this.originalMethods.pushState.apply(history, args);
            this.handleHistoryChange('pushState', args[2]);
        };

        history.replaceState = (...args) => {
            this.originalMethods.replaceState.apply(history, args);
            this.handleHistoryChange('replaceState', args[2]);
        };

        // Monitor popstate events
        window.addEventListener('popstate', (e) => {
            this.handleHistoryChange('popstate', window.location.href);
        });

        // Monitor hash changes
        window.addEventListener('hashchange', (e) => {
            this.handleHistoryChange('hashchange', e.newURL);
        });

        // DOM Mutation Observer for dynamic content changes
        this.setupMutationObserver();
    }

    /**
     * Storage Monitoring
     */
    initStorageMonitoring() {
        // Monitor localStorage changes
        window.addEventListener('storage', (e) => {
            if (this.config.storageKeys.some(key => e.key?.includes(key))) {
                this.log('Storage change detected:', e.key, e.newValue);
                this.processStorageEvent('storage', e.key, e.newValue);
            }
        });

        // Monitor sessionStorage (polling approach as it doesn't fire storage events for same-origin)
        this.monitorSessionStorage();

        // Monitor cookies
        this.monitorCookies();
    }

    /**
     * Custom Event Tracking
     */
    initCustomEventTracking() {
        // Listen for custom purchase events
        const customEvents = ['purchase', 'checkout', 'order_complete', 'payment_success'];
        
        customEvents.forEach(eventName => {
            document.addEventListener(eventName, (e) => {
                this.log('Custom event detected:', eventName, e.detail);
                this.processCustomEvent('custom-event', eventName, e.detail);
            });
        });

        // Monitor form submissions
        document.addEventListener('submit', (e) => {
            if (this.isPurchaseForm(e.target)) {
                this.log('Purchase form submission detected');
                this.processFormSubmission('form-submit', e.target);
            }
        });
    }

    /**
     * Failsafe System Setup
     */
    setupFailsafes() {
        this.primaryMethod = 'network';
        this.fallbackMethods = ['storage', 'history', 'custom-events', 'form-submit'];
        
        // Performance monitoring
        this.setupPerformanceMonitoring();
        
        // Heartbeat for system health
        this.setupHeartbeat();
    }

    /**
     * Event Processing and Scoring System
     */
    startEventProcessor() {
        setInterval(() => {
            if (!this.processingQueue && this.eventQueue.length > 0) {
                this.processEventQueue();
            }
        }, 100);
    }

    async processEventQueue() {
        this.processingQueue = true;
        
        while (this.eventQueue.length > 0) {
            const event = this.eventQueue.shift();
            await this.processTrackingEvent(event);
        }
        
        this.processingQueue = false;
    }

    /**
     * Purchase Detection Methods
     */
    isPurchaseEndpoint(url) {
        if (!url) return false;
        const urlString = typeof url === 'string' ? url : url.toString();
        return this.config.purchaseEndpoints.some(endpoint => 
            urlString.toLowerCase().includes(endpoint.toLowerCase())
        );
    }

    isPurchaseForm(form) {
        const action = form.action || '';
        const formData = new FormData(form);
        const hasPaymentFields = Array.from(formData.keys()).some(key => 
            ['card', 'payment', 'billing', 'checkout'].some(term => 
                key.toLowerCase().includes(term)
            )
        );
        
        return this.isPurchaseEndpoint(action) || hasPaymentFields;
    }

    containsPurchaseData(data) {
        if (!data) return false;
        const dataString = typeof data === 'string' ? data : JSON.stringify(data);
        return this.config.purchaseKeywords.some(keyword => 
            dataString.toLowerCase().includes(keyword.toLowerCase())
        );
    }

    /**
     * Event Processing Methods
     */
    async processPurchaseResponse(source, response, url) {
        try {
            const text = await response.text();
            const purchaseData = this.extractPurchaseData(text, url);
            
            if (purchaseData) {
                this.queueTrackingEvent({
                    source,
                    type: 'purchase_response',
                    data: purchaseData,
                    url,
                    timestamp: Date.now(),
                    confidence: 0.8
                });
            }
        } catch (error) {
            this.log('Error processing purchase response:', error);
        }
    }

    handleHistoryChange(type, url) {
        if (this.isPurchaseEndpoint(url)) {
            this.log('Purchase URL detected via history change:', url);
            
            // Wait for DOM to update
            setTimeout(() => {
                const purchaseData = this.extractPurchaseDataFromDOM();
                this.queueTrackingEvent({
                    source: 'history',
                    type: 'url_change',
                    data: purchaseData,
                    url,
                    timestamp: Date.now(),
                    confidence: 0.6
                });
            }, 500);
        }
    }

    processStorageEvent(source, key, value) {
        if (this.containsPurchaseData(value)) {
            const purchaseData = this.extractPurchaseData(value);
            this.queueTrackingEvent({
                source,
                type: 'storage_change',
                data: purchaseData,
                key,
                timestamp: Date.now(),
                confidence: 0.7
            });
        }
    }

    processCustomEvent(source, eventName, eventData) {
        const purchaseData = this.extractPurchaseData(eventData);
        this.queueTrackingEvent({
            source,
            type: 'custom_event',
            data: purchaseData,
            eventName,
            timestamp: Date.now(),
            confidence: 0.9
        });
    }

    processFormSubmission(source, form) {
        const formData = new FormData(form);
        const purchaseData = this.extractPurchaseDataFromForm(formData);
        this.queueTrackingEvent({
            source,
            type: 'form_submit',
            data: purchaseData,
            action: form.action,
            timestamp: Date.now(),
            confidence: 0.5
        });
    }

    /**
     * Data Extraction Methods
     */
    extractPurchaseData(data, context = '') {
        if (!data) return null;

        let parsedData = {};
        
        try {
            // Try to parse as JSON first
            if (typeof data === 'string') {
                try {
                    parsedData = JSON.parse(data);
                } catch (e) {
                    // If not JSON, extract from text
                    parsedData = this.extractFromText(data);
                }
            } else {
                parsedData = data;
            }

            // Extract common purchase fields
            const purchaseInfo = {
                orderId: this.findValue(parsedData, ['order_id', 'transaction_id', 'orderId', 'transactionId']),
                value: this.findValue(parsedData, ['total', 'amount', 'value', 'price', 'cost']),
                currency: this.findValue(parsedData, ['currency', 'curr']),
                items: this.findValue(parsedData, ['items', 'products', 'line_items']),
                timestamp: Date.now(),
                context
            };

            // Remove null/undefined values
            Object.keys(purchaseInfo).forEach(key => {
                if (purchaseInfo[key] == null) {
                    delete purchaseInfo[key];
                }
            });

            return Object.keys(purchaseInfo).length > 1 ? purchaseInfo : null;
        } catch (error) {
            this.log('Error extracting purchase data:', error);
            return null;
        }
    }

    extractPurchaseDataFromDOM() {
        // Look for purchase confirmation elements
        const selectors = [
            '[class*="order-id"]',
            '[class*="transaction"]',
            '[class*="confirmation"]',
            '[class*="thank-you"]',
            '[class*="success"]',
            '[id*="order"]',
            '[id*="confirmation"]'
        ];

        let purchaseData = {};
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                const text = el.textContent || el.value;
                const extracted = this.extractFromText(text);
                purchaseData = { ...purchaseData, ...extracted };
            });
        });

        return Object.keys(purchaseData).length > 0 ? purchaseData : null;
    }

    extractPurchaseDataFromForm(formData) {
        const purchaseData = {};
        
        for (const [key, value] of formData.entries()) {
            if (this.config.purchaseKeywords.some(keyword => 
                key.toLowerCase().includes(keyword.toLowerCase())
            )) {
                purchaseData[key] = value;
            }
        }
        
        return Object.keys(purchaseData).length > 0 ? purchaseData : null;
    }

    extractFromText(text) {
        const data = {};
        
        // Order ID patterns
        const orderIdMatch = text.match(/(?:order|transaction)[\s#:]*([a-z0-9\-_]+)/i);
        if (orderIdMatch) data.orderId = orderIdMatch[1];
        
        // Price patterns
        const priceMatch = text.match(/\$?(\d+(?:\.\d{2})?)/);
        if (priceMatch) data.value = parseFloat(priceMatch[1]);
        
        // Currency patterns
        const currencyMatch = text.match(/([A-Z]{3})/);
        if (currencyMatch) data.currency = currencyMatch[1];
        
        return data;
    }

    findValue(obj, keys) {
        if (!obj || typeof obj !== 'object') return null;
        
        for (const key of keys) {
            if (obj[key] != null) return obj[key];
            
            // Deep search
            for (const prop in obj) {
                if (prop.toLowerCase().includes(key.toLowerCase()) && obj[prop] != null) {
                    return obj[prop];
                }
            }
        }
        
        return null;
    }

    /**
     * Event Scoring and Validation
     */
    queueTrackingEvent(event) {
        this.eventQueue.push(event);
        this.log('Event queued:', event);
    }

    async processTrackingEvent(event) {
        try {
            // Calculate confidence score
            const confidenceScore = this.calculateConfidenceScore(event);
            event.confidenceScore = confidenceScore;
            
            // Store event
            const eventId = this.generateEventId(event);
            this.purchaseEvents.push({ ...event, id: eventId });
            
            // Check if we should trigger conversion
            const shouldTrigger = await this.shouldTriggerConversion(event);
            
            if (shouldTrigger) {
                await this.triggerGoogleAdsConversion(event);
            }
            
            // Clean up old events
            this.cleanupOldEvents();
            
        } catch (error) {
            this.log('Error processing tracking event:', error);
        }
    }

    calculateConfidenceScore(event) {
        let score = event.confidence || 0.5;
        
        // Boost score based on data quality
        if (event.data?.orderId) score += 0.2;
        if (event.data?.value && event.data.value > 0) score += 0.15;
        if (event.data?.currency) score += 0.1;
        if (event.data?.items) score += 0.1;
        
        // Boost score based on source reliability
        if (event.source === 'network-fetch' || event.source === 'network-xhr') score += 0.1;
        if (event.source === 'custom-event') score += 0.15;
        
        // Penalize if data seems incomplete
        if (!event.data || Object.keys(event.data).length < 2) score -= 0.2;
        
        return Math.min(1.0, Math.max(0.0, score));
    }

    async shouldTriggerConversion(event) {
        // Check confidence threshold
        if (event.confidenceScore < this.config.confidenceThreshold) {
            this.log('Event below confidence threshold:', event.confidenceScore);
            return false;
        }
        
        // Check for duplicate events (deduplication)
        const isDuplicate = this.purchaseEvents.some(existingEvent => 
            existingEvent.id !== event.id &&
            existingEvent.data?.orderId === event.data?.orderId &&
            Math.abs(existingEvent.timestamp - event.timestamp) < 30000 // 30 seconds
        );
        
        if (isDuplicate) {
            this.log('Duplicate event detected, skipping');
            return false;
        }
        
        // Additional validation rules
        return this.validatePurchaseData(event.data);
    }

    validatePurchaseData(data) {
        if (!data) return false;
        
        // Must have either order ID or transaction value
        if (!data.orderId && (!data.value || data.value <= 0)) {
            return false;
        }
        
        // Additional business logic validation can be added here
        return true;
    }

    /**
     * Google Ads Conversion Tracking
     */
    async triggerGoogleAdsConversion(event) {
        try {
            if (!this.config.googleAdsConversionId || !this.config.googleAdsConversionLabel) {
                this.log('Google Ads conversion ID/Label not configured');
                return;
            }
            
            const conversionData = {
                send_to: `${this.config.googleAdsConversionId}/${this.config.googleAdsConversionLabel}`,
                value: event.data?.value || 0,
                currency: event.data?.currency || 'USD',
                transaction_id: event.data?.orderId || this.generateEventId(event)
            };
            
            // Trigger via gtag if available
            if (typeof gtag === 'function') {
                gtag('event', 'conversion', conversionData);
                this.log('Google Ads conversion triggered via gtag:', conversionData);
            }
            
            // Fallback: Send directly to Google Ads
            else {
                await this.sendDirectConversion(conversionData);
            }
            
            // Record successful conversion
            this.recordConversion(event, conversionData);
            
        } catch (error) {
            this.log('Error triggering Google Ads conversion:', error);
            
            // Retry logic
            if (event.retryCount < this.config.maxRetries) {
                event.retryCount = (event.retryCount || 0) + 1;
                setTimeout(() => {
                    this.triggerGoogleAdsConversion(event);
                }, this.config.retryDelay * event.retryCount);
            }
        }
    }

    async sendDirectConversion(conversionData) {
        // Implementation would depend on your specific Google Ads setup
        // This is a placeholder for direct API calls
        this.log('Direct conversion send:', conversionData);
    }

    recordConversion(event, conversionData) {
        const conversionRecord = {
            eventId: event.id,
            timestamp: Date.now(),
            conversionData,
            source: event.source,
            confidenceScore: event.confidenceScore
        };
        
        // Store conversion record (could be sent to your analytics)
        this.log('Conversion recorded:', conversionRecord);
    }

    /**
     * Monitoring and Maintenance
     */
    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.checkElementForPurchaseIndicators(node);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    checkElementForPurchaseIndicators(element) {
        const text = element.textContent || '';
        if (this.containsPurchaseData(text)) {
            const purchaseData = this.extractFromText(text);
            if (purchaseData) {
                this.queueTrackingEvent({
                    source: 'dom-mutation',
                    type: 'element_added',
                    data: purchaseData,
                    timestamp: Date.now(),
                    confidence: 0.4
                });
            }
        }
    }

    monitorSessionStorage() {
        let lastSessionStorage = { ...sessionStorage };
        
        setInterval(() => {
            for (const key of this.config.storageKeys) {
                if (sessionStorage[key] !== lastSessionStorage[key]) {
                    this.processStorageEvent('sessionStorage', key, sessionStorage[key]);
                    lastSessionStorage[key] = sessionStorage[key];
                }
            }
        }, 1000);
    }

    monitorCookies() {
        let lastCookies = document.cookie;
        
        setInterval(() => {
            if (document.cookie !== lastCookies) {
                const newCookies = document.cookie;
                // Simple cookie change detection - could be enhanced
                if (this.containsPurchaseData(newCookies)) {
                    this.processStorageEvent('cookie', 'document.cookie', newCookies);
                }
                lastCookies = newCookies;
            }
        }, 2000);
    }

    setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                    if (entry.entryType === 'navigation' && this.isPurchaseEndpoint(entry.name)) {
                        this.queueTrackingEvent({
                            source: 'performance',
                            type: 'navigation',
                            data: { url: entry.name },
                            timestamp: Date.now(),
                            confidence: 0.3
                        });
                    }
                });
            });
            
            observer.observe({ entryTypes: ['navigation'] });
        }
    }

    setupHeartbeat() {
        setInterval(() => {
            this.log('Heartbeat - System active', {
                eventsQueued: this.eventQueue.length,
                eventsProcessed: this.purchaseEvents.length,
                uptime: Date.now() - this.startTime
            });
        }, 60000); // Every minute
        
        this.startTime = Date.now();
    }

    /**
     * Utility Methods
     */
    generateEventId(event) {
        return `${event.source}-${event.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    cleanupOldEvents() {
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        const cutoff = Date.now() - maxAge;
        
        this.purchaseEvents = this.purchaseEvents.filter(event => 
            event.timestamp > cutoff
        );
    }

    log(...args) {
        if (this.config.debug) {
            console.log('[SecondaryTracking]', ...args);
        }
    }

    /**
     * Public API Methods
     */
    getTrackingStats() {
        return {
            totalEvents: this.purchaseEvents.length,
            queuedEvents: this.eventQueue.length,
            uptime: Date.now() - this.startTime,
            lastEvent: this.purchaseEvents[this.purchaseEvents.length - 1]
        };
    }

    manualTrigger(purchaseData) {
        this.queueTrackingEvent({
            source: 'manual',
            type: 'manual_trigger',
            data: purchaseData,
            timestamp: Date.now(),
            confidence: 1.0
        });
    }

    destroy() {
        // Restore original methods
        if (this.originalMethods.fetch) {
            window.fetch = this.originalMethods.fetch;
        }
        
        if (this.originalMethods.pushState) {
            history.pushState = this.originalMethods.pushState;
        }
        
        if (this.originalMethods.replaceState) {
            history.replaceState = this.originalMethods.replaceState;
        }
        
        if (this.originalMethods.xhrOpen) {
            XMLHttpRequest.prototype.open = this.originalMethods.xhrOpen;
        }
        
        if (this.originalMethods.xhrSend) {
            XMLHttpRequest.prototype.send = this.originalMethods.xhrSend;
        }
        
        this.log('SecondaryTrackingSystem destroyed');
    }
}

// Usage Example:
/*
const tracker = new SecondaryTrackingSystem({
    conversionId: 'AW-XXXXXXXXX',
    conversionLabel: 'your-conversion-label',
    debug: true,
    confidenceThreshold: 0.6,
    purchaseEndpoints: ['/checkout-complete', '/order-success', '/thank-you'],
    purchaseKeywords: ['order_id', 'transaction_id', 'purchase_complete']
});

// Manual trigger if needed
tracker.manualTrigger({
    orderId: 'ORDER123',
    value: 99.99,
    currency: 'USD'
});

// Get tracking statistics
console.log(tracker.getTrackingStats());
*/
