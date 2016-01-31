<h1>New meeting request</h1>

<table>
    <tr>
        <th>Name:</th>
        <td>{{ $name  }}</td>
    </tr>
    <tr>
        <th>Email:</th>
        <td><a href="mailto:{{ $email }}">{{ $email  }}</a></td>
    </tr>
@if ($note)
    <tr>
        <th>Note:</th>
        <td>{{ $note  }}</td>
    </tr>
@endif
    <tr>
        <th>Meeting times:</th>
        <td>
            @if (count($datetimes) > 0)
                {{ join(', ', $datetimes) }}
            @else
                No dates specified
            @endif
        </td>
    </tr>
</table>
