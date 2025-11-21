import { Injectable, signal } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSignal = signal(false);
  private requestCount = 0;

  loading = this.loadingSignal.asReadonly();

  setLoading(loading: boolean): void {
    if (loading) {
      this.requestCount++;
    } else {
      this.requestCount = Math.max(0, this.requestCount - 1);
    }

    this.loadingSignal.set(this.requestCount > 0);
  }
}

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip loading indicator for certain requests
    if (this.shouldSkipLoading(req)) {
      return next.handle(req);
    }

    // Show loading indicator
    this.loadingService.setLoading(true);

    return next.handle(req).pipe(
      // Add small delay to prevent flickering for very fast requests
      delay(100),
      finalize(() => {
        // Hide loading indicator when request completes
        this.loadingService.setLoading(false);
      })
    );
  }

  private shouldSkipLoading(req: HttpRequest<any>): boolean {
    // Skip loading for certain endpoints that should be silent
    const skipUrls = [
      '/health',
      '/ping',
      '/heartbeat'
    ];

    // Skip loading for GET requests that are polling/background requests
    const isBackgroundRequest = req.headers.has('X-Skip-Loading');

    return skipUrls.some(url => req.url.includes(url)) || isBackgroundRequest;
  }
}