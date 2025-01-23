import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateComponentDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    selector: string;

    @IsString()
    @IsNotEmpty()
    position: 'before' | 'after';

    @IsString()
    @IsNotEmpty()
    html: string;

    @IsString()
    @IsOptional()
    css?: string;

    @IsString()
    @IsOptional()
    javascript?: string;

    @IsBoolean()
    @IsNotEmpty()
    isActive: boolean;

    @IsString()
    @IsOptional()
    version?: string;

    @IsString()
    @IsNotEmpty()
    componentType: string;
} 