// Enhanced Pyodide Service - Rock-solid Python execution
// Multiple CDN fallbacks, comprehensive error handling, retry logic

declare global {
  interface Window {
    loadPyodide: any;
    pyodide: any;
  }
}

// CDN fallbacks for maximum reliability
const PYODIDE_CDNS = [
  'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
  'https://unpkg.com/pyodide@0.24.1/dist/',
  'https://pyodide-cdn2.iodide.io/v0.24.1/full/'
] as const;

interface PyodideLoadOptions {
  indexURL: string;
  stdout?: (text: string) => void;
  stderr?: (text: string) => void;
}

class PyodideService {
  private pyodide: any = null;
  private loading: boolean = false;
  private loadPromise: Promise<void> | null = null;
  private currentCdnIndex: number = 0;
  private retryCount: number = 0;
  private maxRetries: number = 3;

  async initialize(): Promise<void> {
    if (this.pyodide) return;
    if (this.loading) return this.loadPromise!;

    this.loading = true;
    this.loadPromise = this._loadPyodideWithFallback();
    await this.loadPromise;
    this.loading = false;
  }

  private async _loadPyodideWithFallback(): Promise<void> {
    const maxCdnAttempts = PYODIDE_CDNS.length;
    
    while (this.currentCdnIndex < maxCdnAttempts && this.retryCount < this.maxRetries) {
      try {
        console.log(`🐍 Attempting to load Pyodide from CDN ${this.currentCdnIndex + 1}/${maxCdnAttempts}...`);
        await this._loadPyodideFromCdn(PYODIDE_CDNS[this.currentCdnIndex]);
        console.log(`✅ Successfully loaded Pyodide from CDN ${this.currentCdnIndex + 1}`);
        return;
      } catch (error) {
        console.error(`❌ Failed to load from CDN ${this.currentCdnIndex + 1}:`, error);
        this.currentCdnIndex++;
        
        if (this.currentCdnIndex >= maxCdnAttempts) {
          this.currentCdnIndex = 0;
          this.retryCount++;
          
          if (this.retryCount < this.maxRetries) {
            console.log(`🔄 Retry attempt ${this.retryCount}/${this.maxRetries}...`);
            await new Promise(resolve => setTimeout(resolve, 2000 * this.retryCount)); // Exponential backoff
          }
        }
      }
    }
    
    throw new Error(`Failed to load Pyodide after ${this.maxRetries} attempts from ${maxCdnAttempts} CDNs`);
  }

  private async _loadPyodideFromCdn(cdnUrl: string): Promise<void> {
    // Clean up any previous attempts
    if (window.pyodide) {
      window.pyodide = undefined;
    }
    
    // Load Pyodide script with timeout
    if (!window.loadPyodide) {
      await this._loadScript(`${cdnUrl}pyodide.js`);
    }

    // Initialize with timeout
    const initPromise = window.loadPyodide({
      indexURL: cdnUrl,
      stdout: (text: string) => {
        console.log('🐍 Python:', text);
      },
      stderr: (text: string) => {
        console.error('🐍 Python Error:', text);
      }
    } as PyodideLoadOptions);

    // Add timeout to prevent hanging
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Pyodide initialization timeout')), 30000);
    });

    this.pyodide = await Promise.race([initPromise, timeoutPromise]);

    // Verify Pyodide is working
    await this._verifyPyodide();
    
    // Load essential packages
    await this._loadPackages();
    
    // Initialize resistance toolkit
    await this._initializeResistanceToolkit();
  }

  private async _loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.crossOrigin = 'anonymous';
      
      const timeout = setTimeout(() => {
        script.remove();
        reject(new Error(`Script loading timeout: ${src}`));
      }, 15000);
      
      script.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        script.remove();
        reject(new Error(`Failed to load script: ${src}`));
      };
      
      document.head.appendChild(script);
    });
  }

  private async _verifyPyodide(): Promise<void> {
    if (!this.pyodide) {
      throw new Error('Pyodide instance is null');
    }
    
    // Test basic functionality
    const testResult = this.pyodide.runPython('2 + 2');
    if (testResult !== 4) {
      throw new Error('Pyodide basic functionality test failed');
    }
  }

  private async _loadPackages(): Promise<void> {
    try {
      console.log('📦 Loading Python packages...');
      await this.pyodide.loadPackage(['numpy', 'pandas']);
      console.log('✅ Python packages loaded successfully');
    } catch (error) {
      console.warn('⚠️ Some packages failed to load, continuing with basic setup:', error);
    }
  }

  private async _initializeResistanceToolkit(): Promise<void> {
    const toolkit = `
import sys
import io
import json
import hashlib
from datetime import datetime

# Redirect stdout to capture print statements
class OutputCapture:
    def __init__(self):
        self.output = []
        
    def write(self, text):
        if text.strip():
            self.output.append(str(text))
            
    def flush(self):
        pass
        
    def getvalue(self):
        return '\\n'.join(self.output)

# Global output capture
_output_capture = OutputCapture()
sys.stdout = _output_capture

def calculate_digital_footprint(posts_per_day, years):
    """Calculate complete digital footprint with realistic data"""
    total_posts = posts_per_day * 365 * years
    data_points = total_posts * 147  # Each post = 147 data points
    hours_scrolling = years * 365 * 3  # 3 hours/day average
    days_lost = hours_scrolling / 24
    value_extracted = total_posts * 0.34  # $0.34 per post
    
    return {
        'total_posts': total_posts,
        'data_points': data_points,
        'hours_lost': hours_scrolling,
        'days_lost': days_lost,
        'value_extracted': value_extracted
    }

def generate_liberation_code(evidence):
    """Generate cryptographic liberation hash"""
    try:
        # Sort evidence for consistent hashing
        evidence_str = json.dumps(evidence, sort_keys=True)
        
        # Create hash with timestamp for uniqueness
        timestamp = datetime.now().isoformat()
        hash_input = f"{evidence_str}_{timestamp}"
        
        # Generate hash
        hash_obj = hashlib.sha256(hash_input.encode())
        liberation_code = hash_obj.hexdigest()[:8].upper()
        
        return liberation_code
    except Exception as e:
        return f"ERROR_{str(e)[:8].upper()}"

# Sample manipulation data for analysis
sample_data = [
    {'timestamp': '2024-01-01 03:00', 'emotional_state': 'vulnerable', 'content_type': 'ad', 'manipulation_score': 0.85, 'clicked_ad': True, 'engagement_time': 45},
    {'timestamp': '2024-01-01 09:00', 'emotional_state': 'happy', 'content_type': 'friend_post', 'manipulation_score': 0.2, 'clicked_ad': False, 'engagement_time': 12},
    {'timestamp': '2024-01-01 14:00', 'emotional_state': 'neutral', 'content_type': 'sponsored', 'manipulation_score': 0.6, 'clicked_ad': False, 'engagement_time': 8},
    {'timestamp': '2024-01-01 22:00', 'emotional_state': 'sad', 'content_type': 'ad', 'manipulation_score': 0.92, 'clicked_ad': True, 'engagement_time': 67},
    {'timestamp': '2024-01-02 01:00', 'emotional_state': 'vulnerable', 'content_type': 'ad', 'manipulation_score': 0.88, 'clicked_ad': True, 'engagement_time': 52},
    {'timestamp': '2024-01-02 10:00', 'emotional_state': 'happy', 'content_type': 'friend_post', 'manipulation_score': 0.15, 'clicked_ad': False, 'engagement_time': 5},
    {'timestamp': '2024-01-02 16:00', 'emotional_state': 'angry', 'content_type': 'sponsored', 'manipulation_score': 0.75, 'clicked_ad': True, 'engagement_time': 38},
    {'timestamp': '2024-01-02 23:00', 'emotional_state': 'vulnerable', 'content_type': 'ad', 'manipulation_score': 0.9, 'clicked_ad': True, 'engagement_time': 71},
    {'timestamp': '2024-01-03 08:00', 'emotional_state': 'neutral', 'content_type': 'friend_post', 'manipulation_score': 0.25, 'clicked_ad': False, 'engagement_time': 10},
    {'timestamp': '2024-01-03 20:00', 'emotional_state': 'sad', 'content_type': 'ad', 'manipulation_score': 0.83, 'clicked_ad': True, 'engagement_time': 49}
]

# Resistance toolkit namespace
class ResistanceToolkit:
    @staticmethod
    def calculate_digital_footprint(posts_per_day, years):
        return calculate_digital_footprint(posts_per_day, years)
    
    @staticmethod
    def generate_liberation_code(evidence):
        return generate_liberation_code(evidence)

resistance = ResistanceToolkit()

print("🔓 Resistance toolkit initialized")
print("🐍 Python environment ready")
print("👻 Ghost protocol active")
`;

    try {
      this.pyodide.runPython(toolkit);
      console.log('🔓 Resistance toolkit initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize resistance toolkit:', error);
      throw error;
    }
  }

  async runCode(code: string): Promise<{ output: string; error: string | null }> {
    if (!this.pyodide) {
      await this.initialize();
    }

    try {
      // Reset output capture
      this.pyodide.runPython(`
_output_capture.output = []
sys.stdout = _output_capture
      `);
      
      // Run user code with error handling
      this.pyodide.runPython(`
try:
    exec('''${code.replace(/'/g, "\\'")}''')
except Exception as e:
    print(f"Error: {type(e).__name__}: {str(e)}")
      `);
      
      // Get output
      const output = this.pyodide.runPython('_output_capture.getvalue()');
      
      return {
        output: output || '',
        error: null
      };
    } catch (error: any) {
      // Detailed error reporting
      const errorMessage = error.message || 'Unknown Python execution error';
      console.error('🐍 Python execution error:', error);
      
      return {
        output: '',
        error: `Execution Error: ${errorMessage}`
      };
    }
  }

  isReady(): boolean {
    return this.pyodide !== null;
  }

  getLoadingState(): {
    isLoading: boolean;
    currentCdn: number;
    retryCount: number;
    status: string;
  } {
    return {
      isLoading: this.loading,
      currentCdn: this.currentCdnIndex + 1,
      retryCount: this.retryCount,
      status: this.loading 
        ? `Loading from CDN ${this.currentCdnIndex + 1}/${PYODIDE_CDNS.length}` 
        : this.pyodide 
          ? 'Ready' 
          : 'Not initialized'
    };
  }

  reset(): void {
    if (this.pyodide) {
      try {
        this.pyodide.runPython(`
# Reset user variables but keep toolkit
user_vars = [name for name in globals().keys() 
             if not name.startswith('_') 
             and name not in ['resistance', 'ResistanceToolkit', 'sample_data', 
                             'calculate_digital_footprint', 'generate_liberation_code',
                             'sys', 'io', 'json', 'hashlib', 'datetime', 'OutputCapture']]

for var in user_vars:
    try:
        del globals()[var]
    except:
        pass

print("🔄 Environment reset - toolkit preserved")
        `);
      } catch (error) {
        console.warn('Warning during reset:', error);
      }
    }
  }
}

// Singleton instance
export const pyodideService = new PyodideService();