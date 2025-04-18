import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

export interface SocialPlatformConfig {
  name: string;
  displayName: string;
  icon: string;
  clientId: string;
  redirectUri: string;
  authEndpoint: string;
  scopes: string[];
  responseType: string;
}

/**
 * Service for managing social platform configurations
 */
@Injectable({
  providedIn: 'root'
})
export class SocialPlatformConfigService {
  /**
   * Get configuration for a social platform
   *
   * @param platform Platform name
   * @returns Social platform configuration
   */
  getPlatformConfig(platform: string): SocialPlatformConfig | null {
    switch (platform) {
      case 'instagram':
        return this.getInstagramConfig();
      // Add cases for additional platforms here
      default:
        return null;
    }
  }

  /**
   * Get OAuth URL for a social platform
   *
   * @param platform Platform name
   * @returns OAuth URL for the platform or null if unsupported
   */
  getOAuthUrl(platform: string): string | null {
    const config = this.getPlatformConfig(platform);
    if (!config) {
      return null;
    }

    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scopes.join(','),
      response_type: config.responseType
    });

    return `${config.authEndpoint}?${params.toString()}`;
  }

  /**
   * Get Instagram configuration
   *
   * @returns Instagram platform configuration
   */
  private getInstagramConfig(): SocialPlatformConfig {
    return {
      name: 'instagram',
      displayName: 'Instagram',
      icon: 'feather:instagram',
      clientId: environment.social.instagram.clientId,
      redirectUri: environment.social.instagram.redirectUri,
      authEndpoint: 'https://api.instagram.com/oauth/authorize',
      scopes: ['instagram_business_basic'],
      responseType: 'code'
    };
  }

  /**
   * Get all supported platform configurations
   *
   * @returns List of all supported social platform configurations
   */
  getAllPlatformConfigs(): SocialPlatformConfig[] {
    return [
      this.getInstagramConfig()
      // Add more platforms as they become supported
    ];
  }
}
